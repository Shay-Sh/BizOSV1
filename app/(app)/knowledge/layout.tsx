export default function KnowledgeBaseLayout({
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
  title: 'Knowledge Base - BizOS',
  description: 'Manage and organize documents for your AI agents',
}; 