export function WelcomeEmail(email: string) {
  return `
    <div style="font-family: Arial, sans-serif; background-color: #f8f5f0; padding: 40px 20px; color: #333;">
      <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #e5e0d8;">

        <div style="background: #6b4f3b; padding: 32px 24px; text-align: center;">
          <h1 style="margin: 0; color: #ffffff; font-size: 30px;">
            Welcome to Vedic Wellness
          </h1>
          <p style="margin-top: 10px; color: #f3e9dd; font-size: 16px;">
            Your wellness journey begins here
          </p>
        </div>

        <div style="padding: 40px 30px;">
          <p style="font-size: 16px; margin-bottom: 20px;">
            Hi ${email},
          </p>

          <p style="font-size: 16px; line-height: 1.7; margin-bottom: 20px;">
            Thank you for joining <strong>Vedic Wellness</strong>. Your account has been successfully verified, and you now have access to a holistic wellness experience inspired by timeless Ayurvedic principles.
          </p>

          <div style="background: #f6efe7; border-radius: 10px; padding: 20px; margin: 30px 0;">
            <h3 style="margin-top: 0; color: #6b4f3b;">
              What you can explore:
            </h3>

            <ul style="padding-left: 20px; line-height: 1.8; margin-bottom: 0;">
              <li>Personalized wellness recommendations</li>
              <li>Ayurvedic products & remedies</li>
              <li>Health insights and lifestyle guidance</li>
              <li>Exclusive member-only benefits</li>
            </ul>
          </div>

          <div style="text-align: center; margin: 35px 0;">
            <a
              href="https://vedic-wellness.vercel.app"
              style="
                display: inline-block;
                background: #6b4f3b;
                color: #ffffff;
                text-decoration: none;
                padding: 14px 28px;
                border-radius: 8px;
                font-size: 16px;
                font-weight: 600;
              "
            >
              Explore Your Dashboard
            </a>
          </div>

          <p style="font-size: 15px; line-height: 1.7; color: #555;">
            We’re glad to have you with us and look forward to supporting your journey toward better health, balance, and mindfulness.
          </p>

          <p style="margin-top: 30px; font-size: 15px;">
            Warm regards,<br />
            <strong>Team Vedic Wellness</strong>
          </p>
        </div>

        <div style="background: #f3eee7; padding: 18px; text-align: center; font-size: 13px; color: #777;">
          © ${new Date().getFullYear()} Vedic Wellness. All rights reserved.
        </div>
      </div>
    </div>
  `;
}