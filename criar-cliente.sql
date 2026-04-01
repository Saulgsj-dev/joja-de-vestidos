-- ============================================
-- SCRIPT PARA CRIAR NOVO CLIENTE
-- Substitua os valores pelos dados do cliente
-- ============================================

-- 1. INSERIR PROFILE
INSERT INTO profiles (id, email, nome_loja, slug, plano, ativo, criado_por_admin, criado_em)
VALUES (
    'UUID-DO-SUPABASE-AQUI',           -- ✅ Pegue do Supabase após criar usuário
    'cliente@email.com',                -- Email do cliente
    'Nome da Loja',                     -- Nome que aparece no site
    'slug-unico',                       -- Slug para URL: seusaas.com/slug-unico
    'basico',                           -- Plano: basico, pro, enterprise
    1,                                  -- 1 = ativo, 0 = desativado
    1,                                  -- 1 = criado por admin
    datetime('now')
);

-- 2. CONFIGURAÇÕES PADRÃO
INSERT INTO loja_config (id, profile_id, cor_fundo, cor_texto, cor_botao, footer_texto, nome_loja)
VALUES (
    lower(hex(randomblob(16))),
    'UUID-DO-SUPABASE-AQUI',
    '#ffffff',
    '#000000',
    '#6366f1',
    '© 2025 Nome da Loja',
    'Nome da Loja'
);

-- 3. SEÇÕES PADRÃO
INSERT INTO page_sections (id, profile_id, section_type, section_order, content, styles, is_active, criado_em)
VALUES
    (lower(hex(randomblob(16))), 'UUID-DO-SUPABASE-AQUI', 'header', 0, '{"title":"Nome da Loja"}', '{"bgType":"solid","bgColor":"#ffffff","textColor":"#000000"}', 1, datetime('now')),
    (lower(hex(randomblob(16))), 'UUID-DO-SUPABASE-AQUI', 'hero', 1, '{"title":"Bem-vindo","subtitle":"Sua mensagem aqui","image":""}', '{"backgroundColor":"#faf5ff"}', 1, datetime('now')),
    (lower(hex(randomblob(16))), 'UUID-DO-SUPABASE-AQUI', 'content', 2, '{"title":"Sobre","text":"Conte sobre você"}', '{}', 1, datetime('now')),
    (lower(hex(randomblob(16))), 'UUID-DO-SUPABASE-AQUI', 'contact', 3, '{"title":"Contato","text":"Entre em contato"}', '{}', 0, datetime('now'));

-- ============================================
-- ENTREGAR AO CLIENTE:
-- URL do site: https://seusaas.com/slug-unico
-- URL do admin: https://seusaas.com/admin
-- Email: cliente@email.com
-- Senha: (a que você criou no Supabase)
-- ============================================