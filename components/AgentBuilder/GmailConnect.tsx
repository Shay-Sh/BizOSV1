import { useState, useEffect } from 'react';
import { getBrowserSupabase } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

export default function GmailConnect() {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [clientError, setClientError] = useState<string | null>(null);
  const { toast } = useToast();
  
  // Check if Gmail is already connected
  const checkGmailConnection = async () => {
    try {
      setIsLoading(true);
      setClientError(null);
      
      // Get Supabase client
      const supabase = getBrowserSupabase();
      
      if (!supabase) {
        setClientError("Unable to initialize Supabase client. Please check your browser console for more details.");
        setIsLoading(false);
        return;
      }
      
      // Get the current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        throw new Error('You must be logged in to connect Gmail');
      }
      
      // Check for Gmail token
      const { data, error } = await supabase
        .from('gmail_auth_tokens')
        .select('updated_at')
        .eq('user_id', user.id)
        .single();
      
      if (error) {
        if (error.code === 'PGRST116') {
          // No token found
          setIsConnected(false);
          setLastUpdated(null);
        } else {
          console.error('Error checking Gmail connection:', error);
          toast({
            title: 'Error',
            description: 'Failed to check Gmail connection status',
            variant: 'destructive',
          });
        }
      } else {
        // Token found
        setIsConnected(true);
        setLastUpdated(data.updated_at);
      }
    } catch (error) {
      console.error('Error in checkGmailConnection:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to check Gmail connection',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Connect to Gmail
  const connectGmail = async () => {
    try {
      setIsLoading(true);
      
      // Redirect to the Gmail OAuth endpoint
      window.location.href = '/api/auth/gmail';
    } catch (error) {
      console.error('Error connecting to Gmail:', error);
      setIsLoading(false);
      toast({
        title: 'Error',
        description: 'Failed to initiate Gmail connection',
        variant: 'destructive',
      });
    }
  };
  
  // Check for success or error message in URL parameters on component mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const success = urlParams.get('success');
    const error = urlParams.get('error');
    
    if (success) {
      toast({
        title: 'Success',
        description: success,
      });
      
      // Remove the query parameters from the URL
      const newUrl = window.location.pathname;
      window.history.replaceState({}, document.title, newUrl);
      
      // Update the connection status
      checkGmailConnection();
    } else if (error) {
      toast({
        title: 'Error',
        description: decodeURIComponent(error),
        variant: 'destructive',
      });
      
      // Remove the query parameters from the URL
      const newUrl = window.location.pathname;
      window.history.replaceState({}, document.title, newUrl);
    } else {
      // Check connection status on component mount
      checkGmailConnection();
    }
  }, []);
  
  if (clientError) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4">
        <h3 className="text-lg font-medium text-red-800">Connection Error</h3>
        <p className="text-sm text-red-700 mt-1">{clientError}</p>
        <p className="text-xs text-red-600 mt-2">
          Please ensure your browser has cookies enabled and that you're logged in.
        </p>
      </div>
    );
  }
  
  return (
    <div className="rounded-lg border p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">Gmail Connection</h3>
          <p className="text-sm text-muted-foreground">
            {isConnected
              ? 'Your Gmail account is connected'
              : 'Connect your Gmail account to create email automation agents'}
          </p>
          {isConnected && lastUpdated && (
            <p className="text-xs text-muted-foreground mt-1">
              Last updated: {new Date(lastUpdated).toLocaleString()}
            </p>
          )}
        </div>
        <Button
          onClick={isConnected ? checkGmailConnection : connectGmail}
          disabled={isLoading}
          variant={isConnected ? 'outline' : 'default'}
        >
          {isLoading
            ? 'Loading...'
            : isConnected
            ? 'Refresh Connection'
            : 'Connect Gmail'}
        </Button>
      </div>
      
      {isConnected && (
        <div className="bg-muted p-3 rounded-md text-sm">
          <p>
            <span className="font-medium">Connection Status:</span>{' '}
            <span className="text-green-600">Active</span>
          </p>
          <p className="mt-1">
            Your agent can now access your Gmail account to automate email processing.
          </p>
        </div>
      )}
    </div>
  );
} 