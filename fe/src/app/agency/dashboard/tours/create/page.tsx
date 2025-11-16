import TabsWrapper from "@/components/agency/main/create/TabsWrapper";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function CreateTourPage() {
  return (
    <Card className="shadow-md bg-slate-50">
      <CardHeader>
        <CardTitle className="text-3xl font-semibold">Tạo mới tour</CardTitle>
      </CardHeader>
      <CardContent>
        <TabsWrapper />
      </CardContent>
    </Card>
  );
}
