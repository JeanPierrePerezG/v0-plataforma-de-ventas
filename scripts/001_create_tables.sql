-- Crear tabla de clientes
CREATE TABLE IF NOT EXISTS public.clientes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre TEXT NOT NULL,
  email TEXT NOT NULL,
  telefono TEXT NOT NULL,
  empresa TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Crear tabla de ventas
CREATE TABLE IF NOT EXISTS public.ventas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cliente_id UUID NOT NULL REFERENCES public.clientes(id) ON DELETE CASCADE,
  producto TEXT NOT NULL,
  monto DECIMAL(10, 2) NOT NULL,
  estado TEXT NOT NULL CHECK (estado IN ('completada', 'pendiente', 'cancelada')),
  notas TEXT,
  fecha TIMESTAMPTZ DEFAULT NOW(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Habilitar Row Level Security
ALTER TABLE public.clientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ventas ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para clientes
CREATE POLICY "Los usuarios pueden ver sus propios clientes"
  ON public.clientes FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Los usuarios pueden insertar sus propios clientes"
  ON public.clientes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Los usuarios pueden actualizar sus propios clientes"
  ON public.clientes FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Los usuarios pueden eliminar sus propios clientes"
  ON public.clientes FOR DELETE
  USING (auth.uid() = user_id);

-- Políticas RLS para ventas
CREATE POLICY "Los usuarios pueden ver sus propias ventas"
  ON public.ventas FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Los usuarios pueden insertar sus propias ventas"
  ON public.ventas FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Los usuarios pueden actualizar sus propias ventas"
  ON public.ventas FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Los usuarios pueden eliminar sus propias ventas"
  ON public.ventas FOR DELETE
  USING (auth.uid() = user_id);

-- Crear índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_clientes_user_id ON public.clientes(user_id);
CREATE INDEX IF NOT EXISTS idx_ventas_user_id ON public.ventas(user_id);
CREATE INDEX IF NOT EXISTS idx_ventas_cliente_id ON public.ventas(cliente_id);
CREATE INDEX IF NOT EXISTS idx_ventas_fecha ON public.ventas(fecha DESC);
CREATE INDEX IF NOT EXISTS idx_ventas_estado ON public.ventas(estado);
