import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Events() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Eventos</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Eventos da Comunidade</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 dark:text-gray-400">
            Esta página mostrará todos os eventos da comunidade.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
