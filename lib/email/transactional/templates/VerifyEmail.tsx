type Props = {
  verificationUrl: string;
};

export function VerifyEmail({ verificationUrl }: Props) {
  return (
    <div>
      <h1>Verify your email</h1>
      <p>Click the link below to verify your account:</p>
      <a href={verificationUrl}>Verify Email</a>
      <p>This link expires in 24 hours.</p>
    </div>
  );
}