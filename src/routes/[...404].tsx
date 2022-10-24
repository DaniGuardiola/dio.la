import { HttpStatusCode } from "solid-start/server";
 
export default function NotFound() {
  return (
    <div>
      <HttpStatusCode code={404} />
      <h1>Page not found</h1>
    </div>
  );


}
