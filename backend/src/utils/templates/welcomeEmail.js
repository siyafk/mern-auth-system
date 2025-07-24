const welcomeEmailTemplate = (name) => {
  return `
    <div style="background:#f7f7f7; padding:40px; font-family:'Segoe UI', Roboto, sans-serif; color:#333;">
      <div style="max-width:600px; margin:auto; background:white; border-radius:10px; box-shadow:0 0 20px rgba(0,0,0,0.05); overflow:hidden;">
        <div style="background:#2f855a; padding:30px;">
          <h1 style="color:white; margin:0; font-size:28px;">👋 Welcome aboard, ${name}!</h1>
          <p style="color:#d0f5df; font-size:16px; margin-top:5px;">You've officially joined a community that builds the future.</p>
        </div>
        <div style="padding:30px;">
          <p style="font-size:18px; margin-bottom:20px;">We’re hyped to have you here. This isn’t just another signup — this is a declaration. A move. You're now part of a space where code meets creativity, and innovation isn't a buzzword — it's a habit.</p>
          <p style="font-size:16px;">From product drops to feature rollouts — you’ll hear from us soon. But for now, take a deep breath and pat yourself on the back. You belong here.</p>

          <div style="text-align:center; margin:40px 0;">
            <a href="https://yourdomain.com/dashboard" style="background:#2f855a; color:white; text-decoration:none; padding:14px 28px; font-size:16px; border-radius:5px; display:inline-block;">🔥 Jump into your dashboard</a>
          </div>

          <p style="font-size:14px; color:#888;">Need help? Just hit reply — we’re real humans over here.</p>
        </div>
        <div style="background:#f0f0f0; padding:15px 30px; text-align:center; font-size:13px; color:#999;">
          🚀 Powered by passion · Crafted with code · You’re one of us now
        </div>
      </div>
    </div>
  `;
};

module.exports = welcomeEmailTemplate;
