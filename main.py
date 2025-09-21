from fastapi import FastAPI, Request
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse, JSONResponse
import json

app = FastAPI()

# Carpeta de templates
templates = Jinja2Templates(directory="templates")

# Carpeta de archivos estáticos
app.mount("/static", StaticFiles(directory="static"), name="static")

# Ruta principal (index)
@app.get("/", response_class=HTMLResponse)
async def index(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})

# Ruta de detalle (renderiza el template)
@app.get("/detalle", response_class=HTMLResponse)
async def detalle(request: Request):
    return templates.TemplateResponse("detalle-producto.html", {"request": request})

# Endpoint para devolver todas las gorras
@app.get("/gorras", response_class=JSONResponse)
async def get_gorras():
    with open("static/gorras.json", "r", encoding="utf-8") as f:
        gorras = json.load(f)
    return gorras

# Endpoint para devolver UNA gorra según su id
@app.get("/gorras/{gorra_id}", response_class=JSONResponse)
async def get_gorra(gorra_id: int):
    with open("static/gorras.json", "r", encoding="utf-8") as f:
        gorras = json.load(f)

    for gorra in gorras:
        if gorra["id"] == gorra_id:
            return gorra

    return {"error": "Producto no encontrado"}
