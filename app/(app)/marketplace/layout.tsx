export default function MarketplaceLayout({
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
  title: 'Agent Marketplace - BizOS',
  description: 'Discover and deploy AI agents for your specific needs',
}; 