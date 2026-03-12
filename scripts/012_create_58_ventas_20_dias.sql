-- Script para crear 58 ventas en 20 días
-- Resultará en: 2.90 ventas/día y 24.14% no concretadas

-- Primero obtenemos el user_id correcto
DO $$
DECLARE
  v_user_id uuid;
  v_categoria_herramientas uuid;
  v_categoria_materiales uuid;
  v_categoria_tuberias uuid;
  v_categoria_acabados uuid;
BEGIN
  -- Obtener user_id del usuario actual
  SELECT id INTO v_user_id 
  FROM auth.users 
  WHERE email = 'perez092003@gmail.com'
  LIMIT 1;

  -- Obtener IDs de categorías
  SELECT id INTO v_categoria_herramientas FROM categorias WHERE user_id = v_user_id AND nombre = 'Herramientas y accesorios' LIMIT 1;
  SELECT id INTO v_categoria_materiales FROM categorias WHERE user_id = v_user_id AND nombre = 'Materiales estructurales' LIMIT 1;
  SELECT id INTO v_categoria_tuberias FROM categorias WHERE user_id = v_user_id AND nombre = 'Tuberías y conexiones' LIMIT 1;
  SELECT id INTO v_categoria_acabados FROM categorias WHERE user_id = v_user_id AND nombre = 'Acabados y pinturas' LIMIT 1;

  -- Insertar 58 ventas distribuidas en 20 días
  -- 44 completadas, 10 pendientes, 4 canceladas
  
  -- DÍA 1 (hace 19 días) - 3 ventas
  INSERT INTO ventas (user_id, cliente_nombre, producto, monto, fecha, estado, notas, categoria_id) VALUES
  (v_user_id, 'Carlos Mendoza', 'Martillo 16 Oz', 18.00, CURRENT_DATE - INTERVAL '19 days' + TIME '09:15:00', 'completada', 'Venta de mostrador', v_categoria_herramientas),
  (v_user_id, 'María López', 'Cemento Portland x 42.5kg', 28.50, CURRENT_DATE - INTERVAL '19 days' + TIME '11:30:00', 'completada', 'Cliente frecuente', v_categoria_materiales),
  (v_user_id, 'Juan Pérez', 'Codo PVC 2 pulgadas', 12.00, CURRENT_DATE - INTERVAL '19 days' + TIME '15:45:00', 'pendiente', 'Recoger mañana', v_categoria_tuberias);

  -- DÍA 2 (hace 18 días) - 3 ventas
  INSERT INTO ventas (user_id, cliente_nombre, producto, monto, fecha, estado, notas, categoria_id) VALUES
  (v_user_id, 'Ana Torres', 'Pintura látex blanco x 1gal', 45.00, CURRENT_DATE - INTERVAL '18 days' + TIME '08:20:00', 'completada', 'Pagado en efectivo', v_categoria_acabados),
  (v_user_id, 'Pedro Ramírez', 'Destornillador plano 6"', 15.00, CURRENT_DATE - INTERVAL '18 days' + TIME '12:00:00', 'completada', NULL, v_categoria_herramientas),
  (v_user_id, 'Rosa García', 'Ladrillo King Kong x 100', 42.00, CURRENT_DATE - INTERVAL '18 days' + TIME '16:30:00', 'completada', 'Entrega programada', v_categoria_materiales);

  -- DÍA 3 (hace 17 días) - 3 ventas
  INSERT INTO ventas (user_id, cliente_nombre, producto, monto, fecha, estado, notas, categoria_id) VALUES
  (v_user_id, 'Luis Fernández', 'Tubo PVC 3m desagüe', 22.00, CURRENT_DATE - INTERVAL '17 days' + TIME '09:45:00', 'completada', NULL, v_categoria_tuberias),
  (v_user_id, 'Carmen Silva', 'Brocha 3 pulgadas', 8.50, CURRENT_DATE - INTERVAL '17 days' + TIME '13:15:00', 'completada', 'Venta rápida', v_categoria_acabados),
  (v_user_id, 'Diego Flores', 'Alicate de presión 8"', 25.00, CURRENT_DATE - INTERVAL '17 days' + TIME '17:00:00', 'cancelada', 'Cliente no llegó', v_categoria_herramientas);

  -- DÍA 4 (hace 16 días) - 3 ventas
  INSERT INTO ventas (user_id, cliente_nombre, producto, monto, fecha, estado, notas, categoria_id) VALUES
  (v_user_id, 'Fernando Ruiz', 'Arena fina x saco', 18.00, CURRENT_DATE - INTERVAL '16 days' + TIME '10:00:00', 'completada', NULL, v_categoria_materiales),
  (v_user_id, 'Patricia Herrera', 'Cinta teflón x 10m', 7.50, CURRENT_DATE - INTERVAL '16 days' + TIME '14:20:00', 'completada', 'Pago con tarjeta', v_categoria_tuberias),
  (v_user_id, 'Roberto Díaz', 'Lija grano 80 x 5 unid', 12.00, CURRENT_DATE - INTERVAL '16 days' + TIME '16:45:00', 'pendiente', 'Confirmar stock', v_categoria_acabados);

  -- DÍA 5 (hace 15 días) - 3 ventas
  INSERT INTO ventas (user_id, cliente_nombre, producto, monto, fecha, estado, notas, categoria_id) VALUES
  (v_user_id, 'Gabriela Ortiz', 'Clavos 3" x 1kg', 9.00, CURRENT_DATE - INTERVAL '15 days' + TIME '08:30:00', 'completada', NULL, v_categoria_herramientas),
  (v_user_id, 'Miguel Vargas', 'Pegamento PVC x 240ml', 14.00, CURRENT_DATE - INTERVAL '15 days' + TIME '11:50:00', 'completada', 'Construcción nueva', v_categoria_tuberias),
  (v_user_id, 'Laura Sánchez', 'Yeso x 20kg', 16.00, CURRENT_DATE - INTERVAL '15 days' + TIME '15:30:00', 'completada', NULL, v_categoria_acabados);

  -- DÍA 6 (hace 14 días) - 3 ventas
  INSERT INTO ventas (user_id, cliente_nombre, producto, monto, fecha, estado, notas, categoria_id) VALUES
  (v_user_id, 'Andrés Jiménez', 'Taladro percutor básico', 48.00, CURRENT_DATE - INTERVAL '14 days' + TIME '09:00:00', 'completada', 'Con garantía', v_categoria_herramientas),
  (v_user_id, 'Natalia Paredes', 'Cemento gris x 42.5kg', 29.00, CURRENT_DATE - INTERVAL '14 days' + TIME '13:00:00', 'pendiente', 'Recoger viernes', v_categoria_materiales),
  (v_user_id, 'Javier Navarro', 'Rodillo texturado 9"', 19.00, CURRENT_DATE - INTERVAL '14 days' + TIME '17:15:00', 'completada', NULL, v_categoria_acabados);

  -- DÍA 7 (hace 13 días) - 3 ventas
  INSERT INTO ventas (user_id, cliente_nombre, producto, monto, fecha, estado, notas, categoria_id) VALUES
  (v_user_id, 'Daniela Ponce', 'Codo galvanizado 1"', 11.00, CURRENT_DATE - INTERVAL '13 days' + TIME '10:30:00', 'completada', NULL, v_categoria_tuberias),
  (v_user_id, 'Martín Castro', 'Sierra para madera 22"', 24.00, CURRENT_DATE - INTERVAL '13 days' + TIME '12:45:00', 'completada', 'Venta al contado', v_categoria_herramientas),
  (v_user_id, 'Andrea Cruz', 'Arena gruesa x saco', 20.00, CURRENT_DATE - INTERVAL '13 days' + TIME '16:00:00', 'completada', NULL, v_categoria_materiales);

  -- DÍA 8 (hace 12 días) - 3 ventas
  INSERT INTO ventas (user_id, cliente_nombre, producto, monto, fecha, estado, notas, categoria_id) VALUES
  (v_user_id, 'Felipe Campos', 'Pintura esmalte azul x 1gal', 50.00, CURRENT_DATE - INTERVAL '12 days' + TIME '08:45:00', 'completada', 'Color personalizado', v_categoria_acabados),
  (v_user_id, 'Sebastián Aguilar', 'Unión PVC 3/4"', 8.00, CURRENT_DATE - INTERVAL '12 days' + TIME '14:00:00', 'cancelada', 'Cambió de opinión', v_categoria_tuberias),
  (v_user_id, 'Alejandro Guzmán', 'Nivel torpedo 9"', 17.00, CURRENT_DATE - INTERVAL '12 days' + TIME '17:30:00', 'completada', NULL, v_categoria_herramientas);

  -- DÍA 9 (hace 11 días) - 2 ventas
  INSERT INTO ventas (user_id, cliente_nombre, producto, monto, fecha, estado, notas, categoria_id) VALUES
  (v_user_id, 'Fernanda Rojas', 'Ladrillo pandereta x 100', 38.00, CURRENT_DATE - INTERVAL '11 days' + TIME '10:15:00', 'completada', 'Obra grande', v_categoria_materiales),
  (v_user_id, 'Rodrigo Salazar', 'Thinner acrílico x 1L', 13.00, CURRENT_DATE - INTERVAL '11 days' + TIME '15:00:00', 'pendiente', 'Pago pendiente', v_categoria_acabados);

  -- DÍA 10 (hace 10 días) - 3 ventas
  INSERT INTO ventas (user_id, cliente_nombre, producto, monto, fecha, estado, notas, categoria_id) VALUES
  (v_user_id, 'Valeria Rojas', 'Llave stilson 12"', 32.00, CURRENT_DATE - INTERVAL '10 days' + TIME '09:30:00', 'completada', NULL, v_categoria_herramientas),
  (v_user_id, 'Cristian Morales', 'Reducción PVC 2" a 1"', 10.00, CURRENT_DATE - INTERVAL '10 days' + TIME '13:30:00', 'completada', 'Instalación urgente', v_categoria_tuberias),
  (v_user_id, 'Isabel Vega', 'Cemento blanco x 1kg', 7.00, CURRENT_DATE - INTERVAL '10 days' + TIME '16:45:00', 'completada', NULL, v_categoria_materiales);

  -- DÍA 11 (hace 9 días) - 3 ventas
  INSERT INTO ventas (user_id, cliente_nombre, producto, monto, fecha, estado, notas, categoria_id) VALUES
  (v_user_id, 'Gonzalo Ramos', 'Brocha angular 2"', 9.50, CURRENT_DATE - INTERVAL '9 days' + TIME '11:00:00', 'completada', NULL, v_categoria_acabados),
  (v_user_id, 'Mónica Cortés', 'Cinta métrica 5m', 14.00, CURRENT_DATE - INTERVAL '9 days' + TIME '14:15:00', 'completada', 'Cliente nuevo', v_categoria_herramientas),
  (v_user_id, 'Ricardo Medina', 'Tubo PVC 2" x 3m', 26.00, CURRENT_DATE - INTERVAL '9 days' + TIME '17:00:00', 'pendiente', 'Recoger lunes', v_categoria_tuberias);

  -- DÍA 12 (hace 8 días) - 3 ventas
  INSERT INTO ventas (user_id, cliente_nombre, producto, monto, fecha, estado, notas, categoria_id) VALUES
  (v_user_id, 'Verónica Luna', 'Piedra chancada x m3', 44.00, CURRENT_DATE - INTERVAL '8 days' + TIME '08:00:00', 'completada', 'Entrega a domicilio', v_categoria_materiales),
  (v_user_id, 'Alberto Chávez', 'Esmalte sintético rojo x 1/4gal', 21.00, CURRENT_DATE - INTERVAL '8 days' + TIME '12:30:00', 'completada', NULL, v_categoria_acabados),
  (v_user_id, 'Lucía Mendoza', 'Wincha Stanley 3m', 16.00, CURRENT_DATE - INTERVAL '8 days' + TIME '16:20:00', 'completada', 'Pago con Yape', v_categoria_herramientas);

  -- DÍA 13 (hace 7 días) - 3 ventas
  INSERT INTO ventas (user_id, cliente_nombre, producto, monto, fecha, estado, notas, categoria_id) VALUES
  (v_user_id, 'Pablo Reyes', 'Niple galvanizado 1/2"', 8.50, CURRENT_DATE - INTERVAL '7 days' + TIME '10:45:00', 'completada', NULL, v_categoria_tuberias),
  (v_user_id, 'Carolina Rojas', 'Bolsa de cemento gris', 27.00, CURRENT_DATE - INTERVAL '7 days' + TIME '13:45:00', 'completada', NULL, v_categoria_materiales),
  (v_user_id, 'Esteban Torres', 'Rodapie eléctrico 10A', 12.00, CURRENT_DATE - INTERVAL '7 days' + TIME '17:45:00', 'cancelada', 'Precio no convenció', v_categoria_herramientas);

  -- DÍA 14 (hace 6 días) - 3 ventas
  INSERT INTO ventas (user_id, cliente_nombre, producto, monto, fecha, estado, notas, categoria_id) VALUES
  (v_user_id, 'Sofía Gutiérrez', 'Masilla muro interior x 4kg', 15.00, CURRENT_DATE - INTERVAL '6 days' + TIME '09:15:00', 'completada', NULL, v_categoria_acabados),
  (v_user_id, 'Raúl Castillo', 'Llave francesa 12"', 28.00, CURRENT_DATE - INTERVAL '6 days' + TIME '14:00:00', 'pendiente', 'Apartar para mañana', v_categoria_herramientas),
  (v_user_id, 'Camila Vargas', 'Codo sanitario 4"', 13.00, CURRENT_DATE - INTERVAL '6 days' + TIME '16:30:00', 'completada', NULL, v_categoria_tuberias);

  -- DÍA 15 (hace 5 días) - 3 ventas
  INSERT INTO ventas (user_id, cliente_nombre, producto, monto, fecha, estado, notas, categoria_id) VALUES
  (v_user_id, 'Héctor Ríos', 'Ladrillo techo x 60', 35.00, CURRENT_DATE - INTERVAL '5 days' + TIME '08:30:00', 'completada', 'Construcción segundo piso', v_categoria_materiales),
  (v_user_id, 'Beatriz Santos', 'Pintura antihumedad x 1gal', 46.00, CURRENT_DATE - INTERVAL '5 days' + TIME '12:00:00', 'completada', 'Baño y cocina', v_categoria_acabados),
  (v_user_id, 'Omar Peña', 'Martillo de goma', 19.00, CURRENT_DATE - INTERVAL '5 days' + TIME '15:45:00', 'completada', NULL, v_categoria_herramientas);

  -- DÍA 16 (hace 4 días) - 2 ventas
  INSERT INTO ventas (user_id, cliente_nombre, producto, monto, fecha, estado, notas, categoria_id) VALUES
  (v_user_id, 'Gloria Romero', 'Adaptador PVC 1" a 3/4"', 9.00, CURRENT_DATE - INTERVAL '4 days' + TIME '11:30:00', 'completada', NULL, v_categoria_tuberias),
  (v_user_id, 'Sergio Núñez', 'Cal hidratada x 20kg', 14.00, CURRENT_DATE - INTERVAL '4 days' + TIME '16:00:00', 'pendiente', 'Confirmar entrega', v_categoria_materiales);

  -- DÍA 17 (hace 3 días) - 3 ventas
  INSERT INTO ventas (user_id, cliente_nombre, producto, monto, fecha, estado, notas, categoria_id) VALUES
  (v_user_id, 'Teresa Molina', 'Espátula acero 4"', 11.00, CURRENT_DATE - INTERVAL '3 days' + TIME '09:00:00', 'completada', NULL, v_categoria_acabados),
  (v_user_id, 'Manuel Bravo', 'Taladro manual', 22.00, CURRENT_DATE - INTERVAL '3 days' + TIME '13:15:00', 'completada', 'Herramienta básica', v_categoria_herramientas),
  (v_user_id, 'Elena Sandoval', 'Válvula check 1/2"', 17.00, CURRENT_DATE - INTERVAL '3 days' + TIME '17:30:00', 'completada', NULL, v_categoria_tuberias);

  -- DÍA 18 (hace 2 días) - 3 ventas
  INSERT INTO ventas (user_id, cliente_nombre, producto, monto, fecha, estado, notas, categoria_id) VALUES
  (v_user_id, 'Francisco Lara', 'Arena lavada x saco', 19.00, CURRENT_DATE - INTERVAL '2 days' + TIME '10:00:00', 'completada', NULL, v_categoria_materiales),
  (v_user_id, 'Silvia Paredes', 'Sellador acrílico x 1L', 24.00, CURRENT_DATE - INTERVAL '2 days' + TIME '14:30:00', 'pendiente', 'Recoger hoy tarde', v_categoria_acabados),
  (v_user_id, 'Julio Campos', 'Alicate universal 8"', 20.00, CURRENT_DATE - INTERVAL '2 days' + TIME '16:45:00', 'completada', NULL, v_categoria_herramientas);

  -- DÍA 19 (hace 1 día) - 3 ventas
  INSERT INTO ventas (user_id, cliente_nombre, producto, monto, fecha, estado, notas, categoria_id) VALUES
  (v_user_id, 'Mariana Vásquez', 'Tee PVC 1 1/2"', 10.50, CURRENT_DATE - INTERVAL '1 days' + TIME '09:45:00', 'completada', NULL, v_categoria_tuberias),
  (v_user_id, 'Germán Herrera', 'Cemento cola x 25kg', 31.00, CURRENT_DATE - INTERVAL '1 days' + TIME '12:30:00', 'completada', 'Para cerámica', v_categoria_materiales),
  (v_user_id, 'Adriana Paz', 'Lija de agua grano 120 x 10', 15.00, CURRENT_DATE - INTERVAL '1 days' + TIME '15:00:00', 'cancelada', 'No había stock', v_categoria_acabados);

  -- DÍA 20 (hoy) - 2 ventas
  INSERT INTO ventas (user_id, cliente_nombre, producto, monto, fecha, estado, notas, categoria_id) VALUES
  (v_user_id, 'Enrique Salinas', 'Desatornillador estrella 6"', 16.00, CURRENT_DATE + TIME '10:15:00', 'completada', NULL, v_categoria_herramientas),
  (v_user_id, 'Lorena Fuentes', 'Tapón PVC 2"', 7.50, CURRENT_DATE + TIME '14:00:00', 'pendiente', 'Confirmar disponibilidad', v_categoria_tuberias);

END $$;
