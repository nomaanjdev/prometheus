import { useEffect, useState } from "react";
import moment from "moment";
import { SpinnerIcon } from "./icons/SpinnerIcon";
import { ApiTimeResponse } from "./models/apiModels";
import * as Security from "./security/Authorization";

const initialTimeData: ApiTimeResponse = {
  epoch: 0,
};

function App() {
  const initialElapsedDisplay = "00:00:00";
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [data, setData] = useState(initialTimeData);
  const [metrics, setMetrics] = useState<string>(null);
  const [elapsed, setElapsed] = useState<string>(initialElapsedDisplay);
  const [error, setError] = useState<string>(null);

  const fetchTime = () => {
    fetch("/time", {
      headers: Security.getAuthorizationHeader(),
    })
      .then<ApiTimeResponse>((response) => {
        if (response.ok) {
          return response.json();
        } else {
          if (response.status === 403) {
            setError("Unauthorized");
          } else {
            throw new Error(response.statusText);
          }
        }
      })
      .then((data) => {
        setData(data);
        setIsLoading(false);
      })
      .catch((error) => {
        setError(error.statusText);
      });
  };

  const fetchMetrics = () => {
    fetch("/metrics", {
      headers: Security.getAuthorizationHeader(),
    })
      .then<string>((response) => response.text())
      .then((data) => setMetrics(data))
      .catch((error) => {
        setError("error");
        console.log(error);
      });
  };

  useEffect(() => {
    const refreshInterval = setInterval(() => {
      setError(null);
      setIsLoading(true);
      setElapsed("00:00:00");

      fetchTime();
      fetchMetrics();
    }, 30000);

    setError(null);
    fetchTime();
    fetchMetrics();

    return () => clearInterval(refreshInterval);
  }, []);

  useEffect(() => {
    const elapsedInterval = setInterval(() => {
      if (!isLoading) {
        const fetched = moment.duration(data.epoch);
        const elapsed = moment().subtract(fetched);
        const formattedElapsed = moment.utc(elapsed).format("HH:mm:ss");
        setElapsed(formattedElapsed);
      }
    }, 1000);

    return () => clearInterval(elapsedInterval);
  }, [isLoading]);

  return (
    <>
      <h1>Prometheus Metrics</h1>
      <div className="App">
        {/* display any errors */}
        {error !== null && <div>Error: {error}</div>}
        {/* display successfull fetch responses */}
        {!error && (
          <>
            <div className="time-container">
              <h1>Fetch time</h1>
              <div className="center">
                <h4>Last fetched</h4>
                {data?.epoch}
                <h4>Time since last fetch</h4>
                {elapsed}
                {isLoading && (
                  <div>
                    <SpinnerIcon />
                  </div>
                )}
              </div>
            </div>
            <div className="metrics-container">
              <h1>Metrics</h1>
              <pre>
                <code>{metrics}</code>
              </pre>
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default App;
