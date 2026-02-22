/**
 * Upstash Redis singleton client
 * Reads credentials from environment variables.
 * Add UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN to .env.local
 */
import { Redis } from '@upstash/redis';

let _redis: Redis | null = null;

export function getRedisClient(): Redis {
    if (_redis) return _redis;

    const url = process.env.UPSTASH_REDIS_REST_URL;
    const token = process.env.UPSTASH_REDIS_REST_TOKEN;

    if (!url || !token) {
        throw new Error(
            '[Upstash] Missing UPSTASH_REDIS_REST_URL or UPSTASH_REDIS_REST_TOKEN. ' +
            'Add them to .env.local (see .env.example for reference).'
        );
    }

    _redis = new Redis({ url, token });
    return _redis;
}

/** Convenience re-export for direct use */
export const redis = {
    get: <T = unknown>(key: string) => getRedisClient().get<T>(key),
    set: (key: string, value: unknown, opts?: { ex: number }) =>
        opts
            ? getRedisClient().set(key, value, { ex: opts.ex })
            : getRedisClient().set(key, value),
    del: (...keys: string[]) => getRedisClient().del(...keys),
    exists: (...keys: string[]) => getRedisClient().exists(...keys),
    expire: (key: string, seconds: number) => getRedisClient().expire(key, seconds),
    lpush: (key: string, ...values: unknown[]) => getRedisClient().lpush(key, ...values),
    lrange: <T = unknown>(key: string, start: number, stop: number) =>
        getRedisClient().lrange<T>(key, start, stop),
    publish: (channel: string, message: string) => getRedisClient().publish(channel, message),
};
