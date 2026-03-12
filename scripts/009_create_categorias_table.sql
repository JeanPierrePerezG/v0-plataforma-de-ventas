-- Crear tabla de categorías
CREATE TABLE IF NOT EXISTS public.categorias (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nombre TEXT NOT NULL,
  descripcion TEXT,
  color TEXT DEFAULT '#3b82f6',
  user_id UUID NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Agregar columna categoria_id a la tabla de ventas
ALTER TABLE public.ventas 
ADD COLUMN IF NOT EXISTS categoria_id UUID REFERENCES public.categorias(id) ON DELETE SET NULL;

-- Crear índices para mejorar rendimiento
CREATE INDEX IF NOT EXISTS idx_categorias_user_id ON public.categorias(user_id);
CREATE INDEX IF NOT EXISTS idx_ventas_categoria_id ON public.ventas(categoria_id);

-- Habilitar Row Level Security en categorias
ALTER TABLE public.categorias ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para categorias
DROP POLICY IF EXISTS "Los usuarios pueden ver sus propias categorías" ON public.categorias;
DROP POLICY IF EXISTS "Los usuarios pueden insertar sus propias categorías" ON public.categorias;
DROP POLICY IF EXISTS "Los usuarios pueden actualizar sus propias categorías" ON public.categorias;
DROP POLICY IF EXISTS "Los usuarios pueden eliminar sus propias categorías" ON public.categorias;

CREATE POLICY "Los usuarios pueden ver sus propias categorías"
  ON public.categorias FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Los usuarios pueden insertar sus propias categorías"
  ON public.categorias FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Los usuarios pueden actualizar sus propias categorías"
  ON public.categorias FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Los usuarios pueden eliminar sus propias categorías"
  ON public.categorias FOR DELETE
  USING (auth.uid() = user_id);

-- Obtener el user_id del primer usuario en auth.users
DO $$
DECLARE
  v_user_id UUID;
BEGIN
  -- Obtener el user_id del primer usuario registrado
  SELECT id INTO v_user_id FROM auth.users LIMIT 1;
  
  -- Insertar categorías predeterminadas solo si hay un usuario
  IF v_user_id IS NOT NULL THEN
    -- Herramientas
    INSERT INTO public.categorias (nombre, descripcion, color, user_id)
    SELECT 'Herramientas', 'Martillos, destornilladores, llaves', '#ef4444', v_user_id
    WHERE NOT EXISTS (
      SELECT 1 FROM public.categorias 
      WHERE nombre = 'Herramientas' AND user_id = v_user_id
    );
    
    -- Materiales de Construcción
    INSERT INTO public.categorias (nombre, descripcion, color, user_id)
    SELECT 'Materiales de Construcción', 'Cemento, fierros, ladrillos', '#f97316', v_user_id
    WHERE NOT EXISTS (
      SELECT 1 FROM public.categorias 
      WHERE nombre = 'Materiales de Construcción' AND user_id = v_user_id
    );
    
    -- Pintura
    INSERT INTO public.categorias (nombre, descripcion, color, user_id)
    SELECT 'Pintura', 'Pinturas, brochas, rodillos', '#eab308', v_user_id
    WHERE NOT EXISTS (
      SELECT 1 FROM public.categorias 
      WHERE nombre = 'Pintura' AND user_id = v_user_id
    );
    
    -- Electricidad
    INSERT INTO public.categorias (nombre, descripcion, color, user_id)
    SELECT 'Electricidad', 'Cables, enchufes, interruptores', '#22c55e', v_user_id
    WHERE NOT EXISTS (
      SELECT 1 FROM public.categorias 
      WHERE nombre = 'Electricidad' AND user_id = v_user_id
    );
    
    -- Plomería
    INSERT INTO public.categorias (nombre, descripcion, color, user_id)
    SELECT 'Plomería', 'Tubos, llaves, grifos', '#3b82f6', v_user_id
    WHERE NOT EXISTS (
      SELECT 1 FROM public.categorias 
      WHERE nombre = 'Plomería' AND user_id = v_user_id
    );
    
    -- Ferretería General
    INSERT INTO public.categorias (nombre, descripcion, color, user_id)
    SELECT 'Ferretería General', 'Clavos, tornillos, bisagras', '#8b5cf6', v_user_id
    WHERE NOT EXISTS (
      SELECT 1 FROM public.categorias 
      WHERE nombre = 'Ferretería General' AND user_id = v_user_id
    );
  END IF;
END $$;
