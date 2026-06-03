"""Управление товарами каталога: GET список, POST создать, DELETE удалить"""
import json
import os
import psycopg2

CORS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, X-Admin-Token",
}

ADMIN_TOKEN = os.environ.get("ADMIN_TOKEN", "")


def get_conn():
    return psycopg2.connect(os.environ["DATABASE_URL"])


def handler(event: dict, context) -> dict:
    method = event.get("httpMethod", "GET")

    if method == "OPTIONS":
        return {"statusCode": 200, "headers": CORS, "body": ""}

    # ── GET /products ──────────────────────────────────────────────────────────
    if method == "GET":
        conn = get_conn()
        cur = conn.cursor()
        cur.execute("""
            SELECT id, title, description, price, category, game,
                   seller, image, images, video_url, views, created_at
            FROM products
            ORDER BY created_at DESC
        """)
        rows = cur.fetchall()
        conn.close()
        products = [
            {
                "id": r[0],
                "title": r[1],
                "description": r[2],
                "price": float(r[3]),
                "category": r[4],
                "game": r[5],
                "seller": r[6],
                "sellerVerified": True,
                "image": r[7] or "",
                "images": r[8] if r[8] else [],
                "videoUrl": r[9] or "",
                "views": r[10],
                "createdAt": r[11].strftime("%Y-%m-%d") if r[11] else "",
            }
            for r in rows
        ]
        return {"statusCode": 200, "headers": {**CORS, "Content-Type": "application/json"},
                "body": json.dumps(products)}

    # ── POST /products ─────────────────────────────────────────────────────────
    if method == "POST":
        token = event.get("headers", {}).get("X-Admin-Token", "")
        if not ADMIN_TOKEN or token != ADMIN_TOKEN:
            return {"statusCode": 403, "headers": CORS, "body": json.dumps({"error": "forbidden"})}

        body = json.loads(event.get("body") or "{}")
        product_id = body["id"]
        conn = get_conn()
        cur = conn.cursor()
        cur.execute("""
            INSERT INTO products (id, title, description, price, category, game,
                                  seller, image, images, video_url, views, created_at)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, NOW())
            ON CONFLICT (id) DO NOTHING
        """, (
            product_id,
            body.get("title", ""),
            body.get("description", ""),
            float(body.get("price", 0)),
            body.get("category", "key"),
            body.get("game", ""),
            body.get("seller", "ADMINISTRATOR CONSOLE"),
            body.get("image", ""),
            json.dumps(body.get("images", [])),
            body.get("videoUrl", ""),
            0,
        ))
        conn.commit()
        conn.close()
        return {"statusCode": 200, "headers": {**CORS, "Content-Type": "application/json"},
                "body": json.dumps({"ok": True, "id": product_id})}

    # ── DELETE /products?id=xxx ────────────────────────────────────────────────
    if method == "DELETE":
        token = event.get("headers", {}).get("X-Admin-Token", "")
        if not ADMIN_TOKEN or token != ADMIN_TOKEN:
            return {"statusCode": 403, "headers": CORS, "body": json.dumps({"error": "forbidden"})}

        params = event.get("queryStringParameters") or {}
        product_id = params.get("id", "")
        if not product_id:
            return {"statusCode": 400, "headers": CORS, "body": json.dumps({"error": "id required"})}

        conn = get_conn()
        cur = conn.cursor()
        cur.execute("DELETE FROM products WHERE id = %s", (product_id,))
        conn.commit()
        conn.close()
        return {"statusCode": 200, "headers": {**CORS, "Content-Type": "application/json"},
                "body": json.dumps({"ok": True})}

    return {"statusCode": 405, "headers": CORS, "body": json.dumps({"error": "method not allowed"})}
