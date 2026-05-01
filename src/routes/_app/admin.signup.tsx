import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/admin/signup")({
  component: AdminSignupRedirect,
});

function AdminSignupRedirect() {
  return (
    <div className="border border-steel-300 bg-card p-8 text-center">
      <div className="font-mono text-[10px] font-bold uppercase tracking-widest text-primary">
        REGISTRATION
      </div>
      <h3 className="mt-1 text-lg font-semibold">Open the SignUp form</h3>
      <p className="mt-2 text-sm text-muted-foreground">
        Operator registration uses the standard SignUp page so the form fields stay
        consistent with self-service signup.
      </p>
      <Link
        to="/signup"
        className="mt-6 inline-block bg-steel-900 px-6 py-2.5 font-mono text-xs font-bold uppercase tracking-widest text-white hover:bg-steel-800"
      >
        Open SignUp page
      </Link>
    </div>
  );
}
