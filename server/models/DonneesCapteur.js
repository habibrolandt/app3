"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DonneesCapteur = void 0;
var mongoose_1 = require("mongoose");
var donneesCapteurSchema = new mongoose_1.default.Schema({
    humiditeSol: {
        type: Number,
        required: true,
        min: 0,
        max: 100,
    },
    pluieDetectee: {
        type: Boolean,
        required: true,
        default: false,
    },
    modeManuel: {
        type: Boolean,
        required: true,
        default: false,
    },
    systemeGlobal: {
        type: Boolean,
        required: true,
        default: true,
    },
    pompeActivee: {
        type: Boolean,
        default: false,
    },
    message: {
        type: String,
        default: "",
    },
    date: {
        type: Date,
        default: Date.now,
    },
});
// Middleware pour vérifier les seuils d'humidité
donneesCapteurSchema.pre("save", function (next) {
    if (this.humiditeSol < 30 && !this.pompeActivee && !this.modeManuel) {
        this.pompeActivee = true;
        this.message = "Irrigation automatique activée - Humidité basse";
    }
    next();
});
exports.DonneesCapteur = mongoose_1.default.model("DonneesCapteur", donneesCapteurSchema);
