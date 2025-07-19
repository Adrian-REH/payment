import express from "express";
import cors from "cors";
import * as dotenv from "dotenv";
import path from 'path';
import Stripe from "stripe";
import morgan from 'morgan';


dotenv.config();





const app = express();
app.use(morgan('combined')); //Logging

app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json()); // Content-Type: application/json

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
  });

interface PaymentService {

  executePayment(token:any , amount: any, email: any): Promise<any>;
};

class  PaymentStripe implements PaymentService {
    private stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

    async executePayment(token:any , amount: any, email: any) {

      //
      try { 
        const charge = await this.stripe.charges.create({
          amount: parseInt(amount),  // Monto del pago en centavos (ej. $20.00)
          currency: 'eur',  // Moneda en la que se realizará el pago
          description: 'Pago de prueba',
          source: token,  // El token que recibimos del cliente
          receipt_email: email,  // Correo electrónico del cliente
        });
      } catch (err) {

      }


    }
}

class  PaymentRedSys implements PaymentService {
    private stripe = new RedSys(process.env.CREDENTIAL_TOKEN_REDSYS!);

    async executePayment(token:any , amount: any, email: any) {

    }
}












app.post('/procesar-pago', async (Request, Response) => {

    const  paymentService: PaymentService  = new PaymentStripe();

    const { token, amount, email } = Request.body;
    console.log(amount)
    try {
      
      const exption: any = paymentService.executePayment();
      // Si el pago es exitoso, respondemos con un mensaje de éxito
      Response.status(200).send({ success: true });
    } catch (error) {
      Response.status(500).send({ success: false, error: error });
    }
});


  
const port = 3030;
// INICIAR SERVIDOR
app.listen(port, '0.0.0.0', () => console.log(`Servidor corriendo en http://localhost:${port}`));
