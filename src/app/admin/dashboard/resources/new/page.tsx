import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import ResourceForm from "@/components/admin/resources/ResourceForm";

export default function NewResourcePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Add New Resource</h1>
        <p className="text-gray-500">Create a new educational resource for your students.</p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Resource Details</CardTitle>
          <CardDescription>
            Fill in the information below to create a new resource. Required fields are marked with an asterisk (*).
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResourceForm />
        </CardContent>
      </Card>
    </div>
  );
}
