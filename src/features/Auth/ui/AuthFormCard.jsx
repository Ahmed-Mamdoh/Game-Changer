import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

function AuthFormCard({ children, btnText }) {
  return (
    <Card className="border-0 bg-transparent shadow-none">
      <CardContent className="grid gap-3 px-0">{children}</CardContent>
      <CardFooter className="px-0">
        <button
          type="submit"
          className="bg-pulse-primary   w-full cursor-pointer rounded-full py-2 text-lg font-semibold"
        >
          {btnText}
        </button>
      </CardFooter>
    </Card>
  );
}
export default AuthFormCard;
