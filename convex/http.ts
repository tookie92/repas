import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { internal } from "./_generated/api";

const http = httpRouter()


export const handleClerkWebhook = httpAction(async (ctx, request) => {
    const {data,type}= await request.json();
  console.log("do Something", data);

  switch (type) {
    case "user.created":
      await ctx.runMutation(internal.users.createUser, {
        clerkId: data.id,
        email: data.email_addresses[0].email_address, // ✅ email_addresses
        first_name: data.first_name,
        last_name: data.last_name,
        imageUrl: data.image_url,
        username: data.username,
      });
      break;
    case "user.updated":
      console.log("login");
      break;
   
  }
  return new Response(null, {status: 200}); 
});

http.route({
  path: "/clerk-users-webhook",
  method: "POST",
  handler: handleClerkWebhook,
});

// https://blessed-ostrich-211.convex.cloud
// https://blessed-ostrich-211.convex.site/clerk-users-webhook
export default http;