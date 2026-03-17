import { supabase } from '../lib/supabase'

// Authentication
export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  return { data, error }
}

export const signOut = async () => {
  const { error } = await supabase.auth.signOut()
  return { error }
}

export const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

// Users
export const getUsers = async () => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
  return { data, error }
}

export const createUser = async (userData: any) => {
  const { data, error } = await supabase
    .from('users')
    .insert(userData)
    .select()
  return { data, error }
}

export const updateUser = async (id: string, userData: any) => {
  const { data, error } = await supabase
    .from('users')
    .update(userData)
    .eq('id', id)
    .select()
  return { data, error }
}

export const deleteUser = async (id: string) => {
  const { error } = await supabase
    .from('users')
    .delete()
    .eq('id', id)
  return { error }
}

// Clients
export const getClients = async () => {
  const { data, error } = await supabase
    .from('clients')
    .select('*')
  return { data, error }
}

export const createClient = async (clientData: any) => {
  const { data, error } = await supabase
    .from('clients')
    .insert(clientData)
    .select()
  return { data, error }
}

export const updateClient = async (id: string, clientData: any) => {
  const { data, error } = await supabase
    .from('clients')
    .update(clientData)
    .eq('id', id)
    .select()
  return { data, error }
}

export const deleteClient = async (id: string) => {
  const { error } = await supabase
    .from('clients')
    .delete()
    .eq('id', id)
  return { error }
}

// Origins
export const getOrigins = async () => {
  const { data, error } = await supabase
    .from('origins')
    .select('*, clients(name)')
  return { data, error }
}

export const createOrigin = async (originData: any) => {
  const { data, error } = await supabase
    .from('origins')
    .insert(originData)
    .select()
  return { data, error }
}

export const updateOrigin = async (id: string, originData: any) => {
  const { data, error } = await supabase
    .from('origins')
    .update(originData)
    .eq('id', id)
    .select()
  return { data, error }
}

// Products
export const getProducts = async () => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
  return { data, error }
}

export const createProduct = async (productData: any) => {
  const { data, error } = await supabase
    .from('products')
    .insert(productData)
    .select()
  return { data, error }
}

export const updateProduct = async (id: string, productData: any) => {
  const { data, error } = await supabase
    .from('products')
    .update(productData)
    .eq('id', id)
    .select()
  return { data, error }
}

// Destinations
export const getDestinations = async () => {
  const { data, error } = await supabase
    .from('destinations')
    .select('*')
  return { data, error }
}

export const createDestination = async (destinationData: any) => {
  const { data, error } = await supabase
    .from('destinations')
    .insert(destinationData)
    .select()
  return { data, error }
}

export const updateDestination = async (id: string, destinationData: any) => {
  const { data, error } = await supabase
    .from('destinations')
    .update(destinationData)
    .eq('id', id)
    .select()
  return { data, error }
}

// Embarkation Points
export const getEmbarkationPoints = async () => {
  const { data, error } = await supabase
    .from('embarkation_points')
    .select('*')
  return { data, error }
}

export const createEmbarkationPoint = async (pointData: any) => {
  const { data, error } = await supabase
    .from('embarkation_points')
    .insert(pointData)
    .select()
  return { data, error }
}

export const updateEmbarkationPoint = async (id: string, pointData: any) => {
  const { data, error } = await supabase
    .from('embarkation_points')
    .update(pointData)
    .eq('id', id)
    .select()
  return { data, error }
}

// Service Orders
export const getServiceOrders = async () => {
  const { data, error } = await supabase
    .from('service_orders')
    .select(`
      *,
      clients(name),
      origins(farm_name),
      products(name),
      destinations(name),
      embarkation_points(name)
    `)
  return { data, error }
}

export const createServiceOrder = async (orderData: any) => {
  const { data, error } = await supabase
    .from('service_orders')
    .insert(orderData)
    .select()
  return { data, error }
}

export const updateServiceOrder = async (id: string, orderData: any) => {
  const { data, error } = await supabase
    .from('service_orders')
    .update(orderData)
    .eq('id', id)
    .select()
  return { data, error }
}

// Classification Results
export const getClassificationResults = async (serviceOrderId?: string) => {
  let query = supabase
    .from('classification_results')
    .select('*, users(name)')
  
  if (serviceOrderId) {
    query = query.eq('service_order_id', serviceOrderId)
  }
  
  const { data, error } = await query
  return { data, error }
}

export const createClassificationResult = async (resultData: any) => {
  const { data, error } = await supabase
    .from('classification_results')
    .insert(resultData)
    .select()
  return { data, error }
}

// Bills
export const getBills = async () => {
  const { data, error } = await supabase
    .from('bills')
    .select('*, service_orders(order_number, clients(name))')
  return { data, error }
}

export const createBill = async (billData: any) => {
  const { data, error } = await supabase
    .from('bills')
    .insert(billData)
    .select()
  return { data, error }
}

export const updateBill = async (id: string, billData: any) => {
  const { data, error } = await supabase
    .from('bills')
    .update(billData)
    .eq('id', id)
    .select()
  return { data, error }
}
