import React, { useRef, useState } from 'react';
import jsPDF from 'jspdf';
import SignatureCanvas from 'react-signature-canvas';
import { QRCodeCanvas } from 'qrcode.react';
import emailjs from '@emailjs/browser';

const TicketModal = ({ venta, detalles = [], onClose, usuario = "Cajero" }) => {
  // ✅ TODOS LOS HOOKS SIEMPRE ARRIBA
  const sigRef = useRef(null);
  const qrRef = useRef(null);
  const [correoCliente, setCorreoCliente] = useState('');

  // ✅ AHORA RECIÉN PODEMOS HACER RETORNO CONDICIONAL
  if (!venta) return null;

  const generarPDF = () => {
    const doc = new jsPDF();
    let y = 10;

    doc.setFontSize(12);
    doc.text('MI TIENDA', 90, y); y += 10;

    doc.setFontSize(10);
    doc.text(`Ticket: ${venta.numero_venta}`, 10, y); y += 6;
    doc.text(`Cajero: ${usuario}`, 10, y); y += 6;
    doc.text(`Método: ${venta.metodo_pago}`, 10, y); y += 6;
    doc.text(`Fecha: ${new Date().toLocaleString()}`, 10, y); y += 10;

    detalles.forEach(item => {
      doc.text(item.nombre, 10, y);
      doc.text(`x${item.cantidad}`, 100, y);
      doc.text(`S/ ${(item.precio * item.cantidad).toFixed(2)}`, 150, y);
      y += 6;
    });

    y += 6;
    doc.text(`TOTAL: S/ ${venta.total.toFixed(2)}`, 10, y); y += 10;

    // ✅ FIRMA
    if (sigRef.current && !sigRef.current.isEmpty()) {
      const firmaImg = sigRef.current.toDataURL('image/png');
      doc.text('Firma del Cajero:', 10, y);
      doc.addImage(firmaImg, 'PNG', 10, y + 5, 60, 25);
      y += 35;
    }

    // ✅ QR
    if (qrRef.current) {
      const qrCanvas = qrRef.current.querySelector('canvas');
      if (qrCanvas) {
        const qrData = qrCanvas.toDataURL();
        doc.addImage(qrData, 'PNG', 140, 10, 40, 40);
      }
    }

    doc.save(`ticket-${venta.numero_venta}.pdf`);
  };

  const limpiarFirma = () => {
    sigRef.current.clear();
  };

  const enviarEmail = async () => {
    if (!correoCliente) {
      alert("⚠️ Ingresa el correo del cliente");
      return;
    }

    try {
      await emailjs.send(
        "service_tu1jedg",
        "template_l1po47z",
        {
          ticket: venta.numero_venta,
          total: venta.total,
          to_email: correoCliente,
        },
        "gCKN36v7qJzKj_2pa"
      );

      alert("✅ Ticket enviado al correo del cliente");
      setCorreoCliente("");

    } catch (error) {
      console.error("Error Email:", error);
      alert("❌ Error al enviar el correo");
    }
  };

  const enviarWhatsApp = () => {
    const mensaje = encodeURIComponent(
      `🧾 MI TIENDA\nTicket: ${venta.numero_venta}\nTotal: S/ ${venta.total}\nGracias por su compra`
    );
    window.open(`https://wa.me/?text=${mensaje}`, '_blank');
  };

  const qrDataVal = `TICKET:${venta.numero_venta}|TOTAL:${venta.total}`;

  return (
    <div style={overlay}>
      <div style={modal}>
        <h3>🧾 Ticket</h3>

        <p><strong>Ticket:</strong> {venta.numero_venta}</p>
        <p><strong>Cajero:</strong> {usuario}</p>
        <p><strong>Método:</strong> {venta.metodo_pago}</p>

        {detalles.map((item, i) => (
          <div key={i} style={fila}>
            <span>{item.nombre} x{item.cantidad}</span>
            <span>S/ {(item.precio * item.cantidad).toFixed(2)}</span>
          </div>
        ))}

        <p><strong>TOTAL:</strong> S/ {venta.total.toFixed(2)}</p>

        <input
          type="email"
          placeholder="Correo del cliente"
          value={correoCliente}
          onChange={(e) => setCorreoCliente(e.target.value)}
          style={inputEmail}
        />

        <SignatureCanvas
          ref={sigRef}
          penColor="black"
          canvasProps={{ width: 280, height: 120, style: { border: '1px solid #ccc' }}}
        />

        <button onClick={limpiarFirma} style={btnSmall}>Limpiar Firma</button>

        <div ref={qrRef} style={{ textAlign: 'center', marginTop: 12 }}>
          <QRCodeCanvas value={qrDataVal} size={100} />
        </div>

        <button onClick={enviarWhatsApp} style={btnWhatsapp}>📲 Enviar por WhatsApp</button>
        <button onClick={enviarEmail} style={btnEmail}>📧 Enviar por Email</button>

        <div style={{ display: 'flex', gap: 10, marginTop: 15 }}>
          <button onClick={generarPDF} style={btnPrint}>📄 Descargar PDF</button>
          <button onClick={onClose} style={btnClose}>❌ Cerrar</button>
        </div>
      </div>
    </div>
  );
};

/* 🎨 ESTILOS */
const overlay = {
  position: 'fixed', inset: 0,
  background: 'rgba(0,0,0,0.5)',
  display: 'flex', justifyContent: 'center', alignItems: 'center',
  zIndex: 1000
};

const modal = { background: 'white', padding: 20, width: 360, borderRadius: 8 };
const fila = { display: 'flex', justifyContent: 'space-between', fontSize: 14 };
const inputEmail = { width: '100%', padding: 8, marginTop: 10, border: '1px solid #ccc', borderRadius: 4 };
const btnPrint = { flex: 1, background: '#1976d2', color: 'white', border: 'none', padding: 10 };
const btnClose = { flex: 1, background: '#d32f2f', color: 'white', border: 'none', padding: 10 };
const btnSmall = { width: '100%', padding: 6, background: '#757575', color: 'white', border: 'none', fontSize: 12, marginTop: 5 };
const btnWhatsapp = { width: '100%', background: '#25D366', color: 'white', padding: 10, border: 'none', marginTop: 10 };
const btnEmail = { width: '100%', background: '#1976d2', color: 'white', padding: 10, border: 'none', marginTop: 8 };

export default TicketModal;
