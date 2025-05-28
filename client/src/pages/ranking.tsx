import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Ranking() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Ranking</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Ranking de Membros</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 dark:text-gray-400">
            Esta página mostrará o ranking completo dos membros da comunidade.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
