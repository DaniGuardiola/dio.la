export default {
  fetch(request: Request): Response {
    const url = new URL(request.url);
    let destination: string | undefined;
    let status = 307;

    switch (url.hostname) {
      case "pgp.dio.la":
        destination = "https://dio.la/pgp.txt";
        status = 308;
        break;
      case "www.dio.la":
        destination = `https://dio.la${url.pathname}`;
        status = 308;
        break;
      case "h.dio.la":
        destination =
          url.pathname === "/"
            ? "https://github.com/DaniGuardiola/home-network"
            : `https://raw.githubusercontent.com/DaniGuardiola/home-network/refs/heads/main${url.pathname}`;
        break;
      case "u.dio.la":
        destination =
          url.pathname === "/"
            ? "https://github.com/DaniGuardiola/utils"
            : `https://raw.githubusercontent.com/DaniGuardiola/utils/refs/heads/main/utils${url.pathname}`;
        break;
      case "h-utils.dio.la":
        if (url.pathname === "/")
          destination =
            "https://raw.githubusercontent.com/DaniGuardiola/home-network/refs/heads/main/scripts/install-utils";
        break;
      case "install-xr.dio.la":
        if (url.pathname === "/")
          destination =
            "https://raw.githubusercontent.com/DaniGuardiola/utils/refs/heads/main/utils/install-xr";
        break;
    }

    if (!destination)
      return new Response("Not found", {
        status: 404,
        headers: { "content-type": "text/plain; charset=utf-8" }
      });

    return Response.redirect(`${destination}${url.search}`, status);
  }
};
