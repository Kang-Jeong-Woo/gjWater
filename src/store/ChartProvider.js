import ChartContext from "./chart-context";
import {useReducer} from "react";

const defaultChartState = {
    name:""
}

const chartReducer = (state, action) => {

}

const ChartProvider = props => {
    const [chartState, dispatchChartState] = useReducer(chartReducer, defaultChartState);

    const chartContext={
        name: chartState.name,
    }

    return(<ChartContext.Provider value={chartContext}>
        {props.children}
    </ChartContext.Provider>)
}
export default ChartProvider;