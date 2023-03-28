
// i will add more soon..

const formatNumber = (num) => {
    if (typeof num !== 'bigint' && num >= 1e63) {
        return (num / 1e63).toFixed(1) + "Vgn";
    } else if (typeof num !== 'bigint' && num >= 1e60) {
        return (num / 1e60).toFixed(1) + "NvD";
    } else if (typeof num !== 'bigint' && num >= 1e57) {
        return (num / 1e57).toFixed(1) + "OcD";
    } else if (typeof num !== 'bigint' && num >= 1e54) {
        return (num / 1e54).toFixed(1) + "SpD";
    } else if (typeof num !== 'bigint' && num >= 1e51) {
        return (num / 1e51).toFixed(1) + "sxD";
    } else if (typeof num !== 'bigint' && num >= 1e48) {
        return (num / 1e48).toFixed(1) + "QnD";
    } else if (typeof num !== 'bigint' && num >= 1e45) {
        return (num / 1e45).toFixed(1) + "qdD";
    } else if (typeof num !== 'bigint' && num >= 1e42) {
        return (num / 1e42).toFixed(1) + "tdD";
    } else if (typeof num !== 'bigint' && num >= 1e39) {
        return (num / 1e39).toFixed(1) + "DD";
    } else if (typeof num !== 'bigint' && num >= 1e36) {
        return (num / 1e36).toFixed(1) + "Ud";
    } else if (typeof num !== 'bigint' && num >= 1e33) {
        return (num / 1e33).toFixed(1) + "De";
    } else if (typeof num !== 'bigint' && num >= 1e30) {
        return (num / 1e30).toFixed(1) + "N";
    } else if (typeof num !== 'bigint' && num >= 1e27) {
        return (num / 1e27).toFixed(1) + "O";
    } else if (typeof num !== 'bigint' && num >= 1e24) {
        return (num / 1e24).toFixed(1) + "Sp";
    } else if (typeof num !== 'bigint' && num >= 1e21) {
        return (num / 1e21).toFixed(1) + "Sx";
    } else if (typeof num !== 'bigint' && num >= 1e18) {
        return (num / 1e18).toFixed(1) + "Qn";
    } else if (typeof num !== 'bigint' && num >= 1e15) {
        return (num / 1e15).toFixed(1) + "Qd";
    } else if (typeof num !== 'bigint' && num >= 1e12) {
        return (num / 1e12).toFixed(1) + "T";
    } else if (typeof num !== 'bigint' && num >= 1e9) {
        return (num / 1e9).toFixed(1) + "B";
    } else if (typeof num !== 'bigint' && num >= 1e6) {
        return (num / 1e6).toFixed(1) + "M";
    } else if (typeof num !== 'bigint' && num >= 1e3) {
        return (num / 1e3).toFixed(1) + "K";
    } else { // K, M, B, T, Qd, Qn, Sx, Sp, O, N, De, Ud, DD, tdD, qdD, QnD, sxD, SpD, OcD, NvD, Vgn
        return num.toString();
    }
}

module.exports = { formatNumber };