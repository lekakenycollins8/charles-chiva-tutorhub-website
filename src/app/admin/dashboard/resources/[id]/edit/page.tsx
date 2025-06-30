import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import ResourceForm from "@/components/admin/resources/ResourceForm";
import { getResource } from "@/lib/actions/resource-actions";
import { notFound } from "next/navigation";

export default async function EditResourcePage({ params }: { params: { id: string } }) {
  const { id } = params;
  const { success, resource, message } = await getResource(id);
  
  if (!success || !resource) {
    notFound();
  }
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Edit Resource</h1>
        <p className="text-gray-500">Update the details of your educational resource.</p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Resource Details</CardTitle>
          <CardDescription>
            Edit the information below to update this resource. Required fields are marked with an asterisk (*).
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResourceForm resource={resource} />
        </CardContent>
      </Card>
    </div>
  );
}
