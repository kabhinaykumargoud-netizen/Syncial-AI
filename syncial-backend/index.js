require('dotenv').config();
const cron = require('node-cron');
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
// We need the service_role key to bypass RLS for background jobs
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_KEY in .env");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

/**
 * Stub function to simulate posting to a social media platform.
 */
async function postToPlatform(content, platform, token) {
  console.log(`[Integration] Posting to ${platform}...`);
  console.log(`  Content: "${content.slice(0, 50)}${content.length > 50 ? '...' : ''}"`);
  console.log(`  Token: ${token}`);
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Simulate success
  console.log(`[Integration] Successfully posted to ${platform}.`);
  return true;
}

/**
 * Job function that runs every minute to find and publish pending posts.
 */
async function processScheduledPosts() {
  console.log(`[${new Date().toISOString()}] Checking for scheduled posts...`);

  // Fetch pending posts scheduled for now or in the past
  const now = new Date().toISOString();
  const { data: posts, error } = await supabase
    .from('posts')
    .select('*')
    .eq('status', 'pending')
    .not('scheduled_time', 'is', null)
    .lte('scheduled_time', now);

  if (error) {
    console.error('Error fetching posts:', error);
    return;
  }

  if (!posts || posts.length === 0) {
    console.log('No posts to publish right now.');
    return;
  }

  console.log(`Found ${posts.length} pending post(s). Processing...`);

  for (const post of posts) {
    try {
      // Fetch user's access token for the specific platform
      const { data: account, error: accountError } = await supabase
        .from('accounts')
        .select('access_token')
        .eq('user_id', post.user_id)
        .eq('platform', post.platform)
        .single();

      if (accountError || !account) {
        console.error(`Skipping post ${post.id}: No connected account found for user ${post.user_id} on ${post.platform}.`);
        // Optionally mark as failed instead of pending
        continue;
      }

      const token = account.access_token;
      
      // Perform the actual posting
      const success = await postToPlatform(post.content, post.platform, token);

      if (success) {
        // Update post status
        const { error: updateError } = await supabase
          .from('posts')
          .update({ status: 'posted' })
          .eq('id', post.id);

        if (updateError) {
          console.error(`Failed to update status for post ${post.id}:`, updateError);
        } else {
          console.log(`Post ${post.id} published and marked as 'posted'.`);
          
          // Optionally insert an initial empty analytics row for the new post
          await supabase.from('analytics').insert({
            post_id: post.id,
            likes: 0,
            comments: 0,
            shares: 0
          });
        }
      }

    } catch (err) {
      console.error(`Error processing post ${post.id}:`, err);
    }
  }
}

// Schedule the job to run every minute
console.log("Syncial Scheduler Service started.");
console.log("Listening for scheduled posts every minute...");
cron.schedule('* * * * *', processScheduledPosts);

// Also run immediately on startup
processScheduledPosts();
