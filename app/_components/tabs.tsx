import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TextToImage } from "./textToImage";
import { ImageAnalysis } from "./imageAnalysis";
import { IngredientRecog } from "./ingredientRecog";

export default function Tab() {
  return (
    <Tabs defaultValue="Image analysis" className="w-100 ">
      <TabsList>
        <TabsTrigger value="Image analysis">Image analysis</TabsTrigger>
        <TabsTrigger value="Ingredient recognition">
          Ingredient recognition
        </TabsTrigger>
        <TabsTrigger value="Image creator">Image creator</TabsTrigger>
      </TabsList>
      <TabsContent value="Image analysis">
        <ImageAnalysis />
      </TabsContent>
      <TabsContent value="Ingredient recognition">
        <IngredientRecog />
      </TabsContent>
      <TabsContent value="Image creator">
        <TextToImage />
      </TabsContent>
    </Tabs>
  );
}
