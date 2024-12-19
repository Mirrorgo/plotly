import D3Treemap from "./components/mg/d3-treemap";
import FoamTreeTreeMap from "./components/mg/foamtree-treemap";
import PlotlyTreemap from "./components/mg/plotly-treemap";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";

function App() {
  return (
    <>
      <div>
        <Tabs defaultValue="plotlyjs" className="w-[400px]">
          <TabsList>
            <TabsTrigger value="plotlyjs">Plotly</TabsTrigger>
            <TabsTrigger value="d3">D3</TabsTrigger>
            <TabsTrigger value="foamtree">Foamtree</TabsTrigger>
          </TabsList>
          <TabsContent value="plotlyjs">
            <PlotlyTreemap />
          </TabsContent>
          <TabsContent value="d3">{/* <D3Treemap /> */}</TabsContent>
          <TabsContent value="foamtree">
            {/* <FoamTreeTreeMap /> */}
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}

export default App;
