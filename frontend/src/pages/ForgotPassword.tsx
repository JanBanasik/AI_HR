
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, ArrowLeft } from "lucide-react";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { forgotPassword } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const success = await forgotPassword(email);
      if (success) {
        setIsSubmitted(true);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <div className="inline-flex items-center mb-2">
            <div className="w-10 h-10 bg-cvision-purple rounded-md flex items-center justify-center mr-2">
              <span className="text-white font-bold text-xl">CV</span>
            </div>
            <span className="text-2xl font-bold">CVision</span>
          </div>
          <h2 className="text-3xl font-bold tracking-tight">Reset Password</h2>
          <p className="text-gray-500">
            {isSubmitted 
              ? "Check your email for reset instructions" 
              : "Enter your email to receive a password reset link"}
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>
              {isSubmitted ? "Email Sent" : "Forgot Password"}
            </CardTitle>
            <CardDescription>
              {isSubmitted 
                ? "If an account exists for the email provided, we've sent instructions to reset your password." 
                : "Enter your email address and we'll send you a link to reset your password."}
            </CardDescription>
          </CardHeader>
          
          {!isSubmitted ? (
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </CardContent>
              <CardFooter className="flex flex-col space-y-2">
                <Button 
                  type="submit" 
                  className="w-full bg-cvision-purple hover:bg-cvision-purple-dark" 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    "Send Reset Link"
                  )}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  className="w-full" 
                  onClick={() => navigate("/login")}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Login
                </Button>
              </CardFooter>
            </form>
          ) : (
            <CardFooter className="flex flex-col space-y-2 pt-6">
              <p className="text-center text-gray-500 mb-4">
                Don't receive an email? Check your spam folder or try again.
              </p>
              <Button 
                type="button" 
                className="w-full bg-cvision-purple hover:bg-cvision-purple-dark" 
                onClick={() => setIsSubmitted(false)}
              >
                Try Again
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                className="w-full" 
                onClick={() => navigate("/login")}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Login
              </Button>
            </CardFooter>
          )}
        </Card>
      </div>
    </div>
  );
};

export default ForgotPassword;
