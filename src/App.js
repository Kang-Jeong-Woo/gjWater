import Map from "./components/Map";
import classes from "./App.css";
import ChartProvider from "./store/ChartProvider";

function App() {
  return (
      <ChartProvider>
          <div className={classes.mapCntnr}>
            <Map/>
          </div>
      </ChartProvider>
  );
}

export default App;
