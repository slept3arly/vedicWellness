type Props = {
  otp: string;
};

export function VerifyEmail({ otp }: Props) {
  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        backgroundColor: "#f8f5f0",
        padding: "40px 20px",
        color: "#333",
      }}
    >
      <div
        style={{
          maxWidth: "600px",
          margin: "0 auto",
          backgroundColor: "#ffffff",
          borderRadius: "12px",
          overflow: "hidden",
          border: "1px solid #e5e0d8",
        }}
      >
        {/* Header */}
        <div
          style={{
            backgroundColor: "#6b4f3b",
            padding: "32px 24px",
            textAlign: "center",
          }}
        >
          <h1
            style={{
              margin: 0,
              color: "#ffffff",
              fontSize: "30px",
            }}
          >
            Verify Your Email
          </h1>

          <p
            style={{
              marginTop: "10px",
              color: "#f3e9dd",
              fontSize: "16px",
            }}
          >
            Secure access to your Vedic Wellness account
          </p>
        </div>

        {/* Body */}
        <div
          style={{
            padding: "40px 30px",
            textAlign: "center",
          }}
        >
          <p
            style={{
              fontSize: "16px",
              lineHeight: 1.7,
              marginBottom: "20px",
            }}
          >
            Use the following OTP to verify your email address and continue your
            wellness journey with us.
          </p>

          {/* OTP Box */}
          <div
            style={{
              backgroundColor: "#f6efe7",
              borderRadius: "12px",
              padding: "24px",
              margin: "30px auto",
              maxWidth: "320px",
            }}
          >
            <p
              style={{
                margin: 0,
                fontSize: "14px",
                color: "#777",
                marginBottom: "12px",
                letterSpacing: "1px",
              }}
            >
              YOUR VERIFICATION CODE
            </p>

            <h2
              style={{
                fontSize: "36px",
                letterSpacing: "8px",
                margin: 0,
                color: "#6b4f3b",
              }}
            >
              {otp}
            </h2>
          </div>

          <p
            style={{
              fontSize: "14px",
              color: "#666",
              lineHeight: 1.6,
            }}
          >
            This OTP will expire in <strong>10 minutes</strong>.
            <br />
            Please do not share this code with anyone.
          </p>

          <p
            style={{
              marginTop: "35px",
              fontSize: "15px",
              color: "#555",
              lineHeight: 1.7,
            }}
          >
            If you did not request this verification, you can safely ignore this
            email.
          </p>
        </div>

        {/* Footer */}
        <div
          style={{
            backgroundColor: "#f3eee7",
            padding: "18px",
            textAlign: "center",
            fontSize: "13px",
            color: "#777",
          }}
        >
          © {new Date().getFullYear()} Vedic Wellness. All rights reserved.
        </div>
      </div>
    </div>
  );
}