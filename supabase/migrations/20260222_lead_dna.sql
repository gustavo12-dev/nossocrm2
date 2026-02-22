-- ============================================================
-- NossoCRM2 Multi-Agent Extension Migration
-- Creates: lead_dna table + contacts.enrichment_data column
-- ============================================================

-- Lead DNA table: stores extracted signals per contact
create table if not exists public.lead_dna (
    id uuid primary key default gen_random_uuid(),
    organization_id uuid not null references public.organizations(id) on delete cascade,
    contact_id uuid not null references public.contacts(id) on delete cascade,
    pains text[] not null default '{}',
    objections text[] not null default '{}',
    avg_ticket numeric,
    revenue numeric,
    decision_maker text,
    raw_signals jsonb not null default '[]',
    updated_at timestamptz not null default now(),
    created_at timestamptz not null default now(),
    constraint lead_dna_org_contact_unique unique (organization_id, contact_id)
);

-- RLS: only members of the organization can see their organization's lead_dna
alter table public.lead_dna enable row level security;

create policy "lead_dna: org members can read"
    on public.lead_dna for select
    using (
        organization_id in (
            select organization_id from public.organization_members
            where user_id = auth.uid()
        )
    );

create policy "lead_dna: org members can write"
    on public.lead_dna for all
    using (
        organization_id in (
            select organization_id from public.organization_members
            where user_id = auth.uid()
        )
    );

-- Index for fast lookup by contact
create index if not exists lead_dna_contact_idx on public.lead_dna (contact_id);
create index if not exists lead_dna_org_idx on public.lead_dna (organization_id);

-- Add enrichment_data column to contacts (jsonb, nullable)
alter table public.contacts
    add column if not exists enrichment_data jsonb;
