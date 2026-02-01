import { LoginCard } from "@/components/LoginCard";

const Login = () => {
  return (
    <div 
      className="flex min-h-screen w-full items-center justify-center p-4"
      style={{ 
        background: 'radial-gradient(ellipse 60% 80% at 50% 40%, #fffdf7, #fafaf8 60%, #fff)',
      }}
    >
      <LoginCard />
    </div>
  );
};

export default Login;
