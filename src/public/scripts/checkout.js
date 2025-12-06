// ✅ IMPORTANTE: Este archivo usa la variable global 'cartId' 
// que se define en checkout.handlebars

async function finalizePurchase() {
    const loading = document.getElementById('loading');
    loading.classList.add('active');

    // ✅ Verificar que cartId esté disponible
    if (!cartId) {
        alert('Error: No se pudo identificar el carrito');
        loading.classList.remove('active');
        return;
    }

    console.log('🛒 Procesando compra para carrito:', cartId);

    try {
        // ✅ Usar la variable cartId que viene del HTML
        const response = await fetch(`/carts/${cartId}/purchase`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const data = await response.json();

        console.log('📦 Respuesta del servidor:', data);

        if (response.ok || response.status === 207) {
            // ✅ Verificar que el ticket tenga ID
            if (!data.ticket || !data.ticket.id) {
                console.error('❌ El ticket no tiene ID:', data.ticket);
                alert('Error: El ticket no se generó correctamente');
                loading.classList.remove('active');
                return;
            }

            console.log('✅ Redirigiendo al ticket:', data.ticket.id);
            
            // Redirigir a la página del ticket
            window.location.href = `/api/tickets/${data.ticket.id}/ticket-details`;
        } else {
            alert(`Error: ${data.message}`);
            loading.classList.remove('active');
        }
    } catch (error) {
        console.error('💥 Error al procesar la compra:', error);
        alert('Ocurrió un error al procesar la compra');
        loading.classList.remove('active');
    }
}