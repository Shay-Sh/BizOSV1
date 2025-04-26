export default function ConversationsLayout({
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
  title: 'Conversations - BizOS',
  description: 'Chat with your AI agents and view conversation history',
}; 