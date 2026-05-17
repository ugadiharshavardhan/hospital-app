export const metadata = {
  title: 'Authentication',
  description: 'Login or register to access MediCare Hospital portal',
};

export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex">
      {children}
    </div>
  );
}
