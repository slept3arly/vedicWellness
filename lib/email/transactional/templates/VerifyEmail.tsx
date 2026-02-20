type Props = {
  otp: string;
};

export function VerifyEmail({ otp }: Props) {
  return (
    <div>
      <h1>Email Verification</h1>

      <p>Your OTP code is:</p>

      <h2
        style={{
          fontSize: "28px",
          letterSpacing: "4px",
          margin: "16px 0",
        }}
      >
        {otp}
      </h2>

      <p>This code expires in 10 minutes.</p>
    </div>
  );
}