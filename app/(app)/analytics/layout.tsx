export default function AnalyticsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full h-full">
      {children}
    </div>
  );
}

export const metadata = {
  title: 'Analytics - BizOS',
  description: 'Monitor and analyze agent performance and platform usage',
}; 