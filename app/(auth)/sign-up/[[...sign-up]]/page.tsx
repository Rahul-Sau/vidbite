import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 p-4">
      <SignUp
        appearance={{
          elements: {
            formButtonPrimary: "btn btn-primary normal-case",
            card: "shadow-xl",
          },
        }}
      />
    </div>
  );
}
