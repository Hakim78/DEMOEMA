from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Dict, Any, Optional
import time
import random

app = FastAPI(title="EDRCF 5.0 | M&A Signal Radar", version="5.0.0")

# Restrict CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:3001",
        "https://*.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Business Logic & Scoring Constants ---

SIGNAL_WEIGHTS = {
    "holding_creation": 5,
    "sci_creation": 3,
    "shares_contribution": 5,
    "capital_modification": 3,
    "cfo_recruitment": 4,
    "ceo_non_founder": 4,
    "m_and_a_director": 5,
    "founder_retirement": 5,
    "refinancing": 3,
    "debt_surge": 4,
    "profitability_drop": 3,
    "abnormal_growth": 4,
    "filialisation": 4,
    "carve_out": 5,
    "asset_separation": 4,
    "acquisition_disposal": 4,
    "strategic_refocus": 3,
    "sector_consolidation": 5,
    "founder_age_58_plus": 5,
    "no_succession": 4,
}

# --- Mock Data ---

MOCK_TARGETS: List[Dict[str, Any]] = [
    {
        "id": "edrcf-1",
        "name": "TechFlow Industrials",
        "sector": "Industrial Tech",
        "globalScore": 42.5,
        "priorityLevel": "Opportunité Forte",
        "topSignals": [
            {"id": "cfo_recruitment", "label": "Recrutement DAF (ex-PE)", "family": "Management"},
            {"id": "holding_creation", "label": "Création Holding de contrôle", "family": "Patrimonial"},
            {"id": "founder_age_58_plus", "label": "Fondateur > 60 ans", "family": "Dirigeant"},
            {"id": "carve_out", "label": "Filialisation branche non-core", "family": "Structure"}
        ],
        "analysis": {
            "type": "Transmission / LBO",
            "window": "6-12 mois",
            "narrative": "Le faisceau de signaux suggère une mise en ordre patrimoniale préalable à une transmission ou une ouverture minoritaire sous 6 à 12 mois. Le recrutement récent d'un DAF issu du Private Equity confirme la professionnalisation en vue d'un processus."
        },
        "activation": {
            "deciders": ["Jean-Marc Vallet (Fondateur)", "Sophie Durand (DAF)"],
            "approach": "Approche directe via réseau alumni (X-Mines)",
            "reason": "Discussion sur la pérennisation industrielle et la structuration du capital post-carveout."
        },
        "risks": {
            "falsePositive": "Léger (0.12)",
            "uncertainties": "Capacité réelle du fondateur à déléguer le processus opérationnel."
        },
        "scores": {
            "patrimonial": 85,
            "management": 92,
            "financial": 45,
            "structure": 88,
            "strategic": 70
        }
    },
    {
        "id": "edrcf-2",
        "name": "BioGrid Pharma",
        "sector": "MedTech",
        "globalScore": 31.2,
        "priorityLevel": "Cible Prioritaire",
        "topSignals": [
            {"id": "strategic_refocus", "label": "Recentrage stratégique annoncé", "family": "Stratégie"},
            {"id": "debt_surge", "label": "Hausse de l'endettement financier", "family": "Financier"},
            {"id": "ceo_non_founder", "label": "DG non fondateur en place", "family": "Management"}
        ],
        "analysis": {
            "type": "Ouverture de Capital",
            "window": "12-18 mois",
            "narrative": "La montée de l'endettement couplée à un recentrage sur les actifs core indique un besoin probable de fonds propres pour financer la prochaine phase de croissance ou un désengagement partiel des actionnaires historiques."
        },
        "activation": {
            "deciders": ["Marc Lepic (DG)", "Conseil d'Administration"],
            "approach": "Angle sectoriel / Consolidation",
            "reason": "Support au plan stratégique 2027 et optimisation de la structure de bilan."
        },
        "risks": {
            "falsePositive": "Moyen (0.21)",
            "uncertainties": "Calendrier de refinancement de la dette senior."
        },
        "scores": {
            "patrimonial": 40,
            "management": 75,
            "financial": 88,
            "structure": 30,
            "strategic": 82
        }
    },
    {
        "id": "edrcf-3",
        "name": "Lumix Logistics",
        "sector": "Logistics",
        "globalScore": 24.8,
        "priorityLevel": "Cible à Préparer",
        "topSignals": [
            {"id": "sci_creation", "label": "Création SCI immobilière", "family": "Patrimonial"},
            {"id": "sector_consolidation", "label": "Consolidation forte du secteur", "family": "Secteur"}
        ],
        "analysis": {
            "type": "Cession / Consolidation",
            "window": "18+ mois",
            "narrative": "L'isolation des actifs immobiliers via une SCI est un signal classique de préparation de cession d'exploitation. Dans un secteur en pleine consolidation, Lumix devient une proie naturelle pour un roll-up."
        },
        "activation": {
            "deciders": ["Famille Luminaire"],
            "approach": "Veille stratégique / Partenariat",
            "reason": "Discussion sur la valeur des actifs immobiliers vs opérationnels dans le marché actuel."
        },
        "risks": {
            "falsePositive": "Fort (0.35)",
            "uncertainties": "Attachement émotionnel à l'entreprise familiale."
        },
        "scores": {
            "patrimonial": 90,
            "management": 30,
            "financial": 50,
            "structure": 60,
            "strategic": 75
        }
    }
]

@app.get("/api/targets")
def get_targets(
    q: Optional[str] = Query(None),
    sector: Optional[str] = Query(None)
):
    results = MOCK_TARGETS
    if q:
        q_lower = q.lower()
        results = [t for t in results if q_lower in str(t["name"]).lower() or q_lower in str(t["sector"]).lower()]
    if sector:
        results = [t for t in results if str(t["sector"]).lower() == sector.lower()]
    return {"data": results}

@app.get("/api/targets/{target_id}")
def get_target(target_id: str):
    target = next((t for t in MOCK_TARGETS if t["id"] == target_id), None)
    if target:
        return {"data": target}
    raise HTTPException(status_code=404, detail="Target not found")

@app.get("/api/signals")
def get_signals():
    signals_feed = []
    for t in MOCK_TARGETS:
        for s in t["topSignals"]:
            signals_feed.append({
                "id": f"{t['id']}-{s['id']}",
                "type": s["family"],
                "title": f"{s['label']} détecté chez {t['name']}",
                "time": "Récent",
                "source": "EDRCF Radar",
                "severity": "high" if t["globalScore"] > 35 else "medium",
                "location": "France",
                "tags": [s["family"], t["sector"]]
            })
    return {"data": signals_feed}

@app.get("/api/pipeline")
def get_pipeline():
    pipeline = [
        { "id": "id", "title": "Identification", "cards": [] },
        { "id": "qual", "title": "Qualification", "cards": [] },
        { "id": "prep", "title": "Cible à Préparer", "cards": [] },
        { "id": "prio", "title": "Cible Prioritaire", "cards": [] },
        { "id": "opp", "title": "Opportunité Forte", "cards": [] }
    ]
    
    for t in MOCK_TARGETS:
        level = t["priorityLevel"]
        card = {
            "id": t["id"],
            "name": t["name"],
            "sector": t["sector"],
            "score": t["globalScore"],
            "tags": [t["analysis"]["type"]],
            "priority": "high" if t["globalScore"] > 30 else "medium"
        }
        if level == "Opportunité Forte": pipeline[4]["cards"].append(card)
        elif level == "Cible Prioritaire": pipeline[3]["cards"].append(card)
        elif level == "Cible à Préparer": pipeline[2]["cards"].append(card)
        elif level == "Watchlist": pipeline[1]["cards"].append(card)
        else: pipeline[0]["cards"].append(card)
        
    return {"data": pipeline}

@app.get("/api/copilot/query")
def copilot_query(q: str = Query(...)):
    time.sleep(1)
    q_l = q.lower()
    if "radar" in q_l or "signal" in q_l:
        return {"response": "Le radar EDRCF 5.0 a identifié une convergence majeure chez TechFlow Industrials : création de holding + recrutement DAF + fondateur > 60 ans. Score de 42.5 (Opportunité Forte). Je recommande une approche via réseau alumni."}
    return {"response": "Je peux analyser une cible spécifique ou filtrer le radar par famille de signaux (ex: Patrimonial, Dirigeant). Que souhaitez-vous approfondir ?"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
