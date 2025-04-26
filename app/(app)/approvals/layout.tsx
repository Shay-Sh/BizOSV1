export default function ApprovalsLayout({
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
  title: 'Approval Center - BizOS',
  description: 'Manage human-in-the-loop decisions for AI agents',
}; 