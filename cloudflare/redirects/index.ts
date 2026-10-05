export default {
  fetch(request: Request): Response {
    const url = new URL(request.url);
    let destination: string | undefined;
    let status = 307;

    switch (url.hostname) {
      case "pgp.dio.la":
      case "pgp.daniguardio.la":
        destination = "https://dio.la/pgp.txt";
        status = 308;
        break;
      case "daniguardio.la":
        destination = `https://dio.la${url.pathname}`;
        status = 308;
        break;
      case "www.daniguardio.la":
      case "beta.daniguardio.la":
        destination = `https://daniguardio.la${url.pathname}`;
        break;
      case "pop-os.daniguardio.la":
        destination =
          "https://raw.githubusercontent.com/DaniGuardiola/pop-os-setup/main/downloader.sh";
        status = 308;
        break;
      case "www.notmylinkedin.com":
        destination = `https://notmylinkedin.com${url.pathname}`;
        break;
      case "notmylinkedin.com":
      case "linkedin.com.notmylinkedin.com":
        // The existing redirect removes an incoming marker instead of
        // appending it twice; preserve that behavior as well as other queries.
        if (url.searchParams.has("notmylinkedin")) {
          url.searchParams.delete("notmylinkedin");
          return Response.redirect(`https://dio.la/me${url.search}`, 308);
        }
        return Response.redirect(
          `https://dio.la/me${url.search ? `${url.search}&` : "?"}notmylinkedin`,
          308
        );
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
