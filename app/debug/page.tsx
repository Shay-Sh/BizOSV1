'use client';

export default function DebugPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Environment Variable Debug</h1>
      <pre style={{whiteSpace: 'pre-wrap', fontFamily: 'monospace', background: '#f5f5f5', padding: '1rem', borderRadius: '0.5rem'}}>
        {JSON.stringify(
          {
            url: process.env.NEXT_PUBLIC_SUPABASE_URL,
            anon: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 
              `${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.substring(0, 5)}...` : '(not set)'
          },
          null,
          2
        )}
      </pre>
    </div>
  );
} 