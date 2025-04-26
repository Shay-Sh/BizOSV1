import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Messages | BizOS',
  description: 'View and manage your messages and conversations',
};

export default function MessagesPage() {
  const conversations = [
    {
      id: 'conv-1',
      name: 'Data Import Questions',
      lastMessage: 'I need to import data from a CSV file with custom columns. Can you help me set up the mapping?',
      unread: 2,
      date: '2023-06-28',
      participants: ['Data Assistant', 'You'],
      status: 'active'
    },
    {
      id: 'conv-2',
      name: 'Sales Report Automation',
      lastMessage: 'Your automated report has been generated. You can view it here or download it directly.',
      unread: 0,
      date: '2023-06-27',
      participants: ['Report Bot', 'You', 'Marketing Team'],
      status: 'active'
    },
    {
      id: 'conv-3',
      name: 'Customer Order #38291',
      lastMessage: 'The order has been processed and shipped. The tracking number is ABC123456789.',
      unread: 0,
      date: '2023-06-25',
      participants: ['Order Assistant', 'You', 'Customer Support'],
      status: 'active'
    },
    {
      id: 'conv-4',
      name: 'Invoice Processing Setup',
      lastMessage: 'I\'ve configured the invoice recognition model. Please upload a sample invoice to test.',
      unread: 1,
      date: '2023-06-24',
      participants: ['Invoice Bot', 'You'],
      status: 'active'
    },
    {
      id: 'conv-5',
      name: 'Weekly Team Update',
      lastMessage: 'Here\'s a summary of this week\'s activities and upcoming tasks for next week.',
      unread: 0,
      date: '2023-06-21',
      participants: ['Team Assistant', 'You', '+5 others'],
      status: 'archived'
    }
  ];

  const activeConversations = conversations.filter(conv => conv.status === 'active');
  const archivedConversations = conversations.filter(conv => conv.status === 'archived');

  return (
    <div className="p-6 space-y-6">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold mb-2">Messages</h1>
          <p className="text-muted-foreground">Manage your conversations with agents and team members</p>
        </div>
        <button className="px-4 py-2 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90">
          New Conversation
        </button>
      </header>

      <div className="space-y-2">
        <div className="relative">
          <input 
            type="text" 
            placeholder="Search messages..." 
            className="w-full pl-10 pr-4 py-2 border rounded-md bg-background"
          />
          <svg 
            className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
            />
          </svg>
        </div>
      </div>

      <div className="space-y-6">
        <section>
          <h2 className="text-xl font-semibold mb-4">Active Conversations</h2>
          <div className="space-y-2">
            {activeConversations.map((conversation) => (
              <div key={conversation.id} className="flex items-start p-4 rounded-lg border bg-card hover:bg-accent/50 cursor-pointer">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-medium">{conversation.name}</h3>
                    <span className="text-sm text-muted-foreground">{conversation.date}</span>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-1">{conversation.lastMessage}</p>
                  <div className="flex items-center mt-2 text-xs text-muted-foreground">
                    <span>{conversation.participants.join(', ')}</span>
                  </div>
                </div>
                {conversation.unread > 0 && (
                  <div className="ml-4 bg-primary text-primary-foreground text-xs font-bold px-2 py-1 rounded-full">
                    {conversation.unread}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {archivedConversations.length > 0 && (
          <section>
            <h2 className="text-xl font-semibold mb-4">Archived</h2>
            <div className="space-y-2">
              {archivedConversations.map((conversation) => (
                <div key={conversation.id} className="flex items-start p-4 rounded-lg border bg-card hover:bg-accent/50 cursor-pointer opacity-70">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-medium">{conversation.name}</h3>
                      <span className="text-sm text-muted-foreground">{conversation.date}</span>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-1">{conversation.lastMessage}</p>
                    <div className="flex items-center mt-2 text-xs text-muted-foreground">
                      <span>{conversation.participants.join(', ')}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
} 