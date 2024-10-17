Deno.serve((req) => {
  const body = JSON.stringify({ message: "NOT FOUND" });

  return new Response(body, {
    status: 404,
    headers: {
      "content-type": "application/json; charset=utf-8",
    },
  });
});
