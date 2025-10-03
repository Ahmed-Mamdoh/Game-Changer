import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

function AuthFormCard({ title, description, children, btnText }) {
  return (
    <Card className="base-content bg-base-100 border-base-300">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription className="text-text-subtle">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6">{children}</CardContent>
      <CardFooter>
        <Button type="submit" className="w-full cursor-pointer py-5">
          {btnText}
        </Button>
      </CardFooter>
    </Card>
  );
}
export default AuthFormCard;
