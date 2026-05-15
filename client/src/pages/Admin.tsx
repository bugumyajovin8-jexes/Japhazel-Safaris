import React, { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { 
  LayoutDashboard, 
  Map, 
  Users, 
  Calendar, 
  Settings, 
  LogOut, 
  Plus,
  Image as ImageIcon,
  Edit,
  Trash2,
  Mail as MailIcon,
  CheckCircle,
  Clock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useStore } from "@/lib/store";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { toursApi, bookingsApi, galleryApi, contactApi, settingsApi } from "@/lib/api";
import type { Tour, Booking, GalleryItem, ContactMessage } from "@shared/schema";

export default function Admin() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const { user, logout } = useStore();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const { data: tours = [], isLoading: toursLoading } = useQuery({
    queryKey: ["tours"],
    queryFn: toursApi.getAll,
  });

  const { data: bookings = [], isLoading: bookingsLoading } = useQuery({
    queryKey: ["bookings"],
    queryFn: bookingsApi.getAll,
  });

  const { data: gallery = [], isLoading: galleryLoading } = useQuery({
    queryKey: ["gallery"],
    queryFn: galleryApi.getAll,
  });

  const { data: messages = [], isLoading: messagesLoading } = useQuery({
    queryKey: ["contactMessages"],
    queryFn: contactApi.getAll,
  });

  const { data: settingsData = {}, isLoading: settingsLoading } = useQuery({
    queryKey: ["settings"],
    queryFn: settingsApi.getAll,
  });

  // Form State
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTour, setEditingTour] = useState<Tour | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    location: "",
    price: 0,
    duration: "",
    description: "",
    image: "",
    highlights: [] as string[],
  });

  // Account settings state
  const [accountSettings, setAccountSettings] = useState({
    name: user?.name || "",
    email: user?.email || "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Hero setting state
  const [heroMediaUrls, setHeroMediaUrls] = useState("");
  
  // Update state when settings load
  useEffect(() => {
    if (settingsData && settingsData["hero_media_urls"] !== undefined) {
      setHeroMediaUrls(settingsData["hero_media_urls"]);
    } else if (settingsData && settingsData["hero_video"]) {
      // fallback
      setHeroMediaUrls(settingsData["hero_video"]);
    }
  }, [settingsData]);

  // Gallery Form State
  const [isGalleryDialogOpen, setIsGalleryDialogOpen] = useState(false);
  const [galleryFormData, setGalleryFormData] = useState({
    url: "",
    caption: "",
    category: "general",
  });

  // Mutations
  const createTourMutation = useMutation({
    mutationFn: toursApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tours"] });
      toast({ title: "Tour Created", description: `${formData.title} has been created.` });
      setIsDialogOpen(false);
    },
    onError: (error: Error) => {
      toast({ variant: "destructive", title: "Error", description: error.message });
    },
  });

  const updateTourMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => toursApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tours"] });
      toast({ title: "Tour Updated", description: `${formData.title} has been updated.` });
      setIsDialogOpen(false);
    },
    onError: (error: Error) => {
      toast({ variant: "destructive", title: "Error", description: error.message });
    },
  });

  const deleteTourMutation = useMutation({
    mutationFn: toursApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tours"] });
      toast({ title: "Tour Deleted", variant: "destructive" });
    },
    onError: (error: Error) => {
      toast({ variant: "destructive", title: "Error", description: error.message });
    },
  });

  const updateBookingStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) => bookingsApi.updateStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      toast({ title: "Booking Updated", description: "Booking status has been updated." });
    },
    onError: (error: Error) => {
      toast({ variant: "destructive", title: "Error", description: error.message });
    },
  });

  const updateAccountMutation = useMutation({
    mutationFn: async (data: any) => {
      if (!supabase) throw new Error("Supabase is not configured.");

      const updates: { email?: string; password?: string, data?: { name: string } } = {};
      
      if (data.email) updates.email = data.email;
      if (data.newPassword) updates.password = data.newPassword;
      if (data.name) updates.data = { name: data.name };

      const { data: userData, error } = await supabase.auth.updateUser(updates);
      
      if (error) {
        throw new Error(error.message);
      }
      return userData;
    },
    onSuccess: (data: any) => {
      if (data?.user?.new_email) {
        toast({ title: "Check your email", description: "You need to verify your new email address for the change to take effect." });
      } else {
        toast({ title: "Success", description: "Account settings updated successfully." });
      }
      setAccountSettings(prev => ({ ...prev, currentPassword: "", newPassword: "", confirmPassword: "" }));
    },
    onError: (error: Error) => {
      toast({ variant: "destructive", title: "Error", description: error.message });
    },
  });

  const updateSettingMutation = useMutation({
    mutationFn: ({ key, value }: { key: string; value: string }) => settingsApi.update(key, value),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["settings"] });
      toast({ title: "Settings Updated", description: "Your settings have been saved." });
    },
    onError: (error: Error) => {
      toast({ variant: "destructive", title: "Error", description: error.message });
    },
  });

  const createGalleryItemMutation = useMutation({
    mutationFn: galleryApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gallery"] });
      toast({ title: "Image Added", description: "The image has been added to the gallery." });
      setIsGalleryDialogOpen(false);
      setGalleryFormData({ url: "", caption: "", category: "general" });
    },
    onError: (error: Error) => {
      toast({ variant: "destructive", title: "Error", description: error.message });
    },
  });

  const deleteGalleryItemMutation = useMutation({
    mutationFn: galleryApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gallery"] });
      toast({ title: "Image Deleted", variant: "destructive" });
    },
    onError: (error: Error) => {
      toast({ variant: "destructive", title: "Error", description: error.message });
    },
  });

  const updateMessageStatusMutation = useMutation({
    mutationFn: ({ id, isRead }: { id: number; isRead: boolean }) => contactApi.updateStatus(id, isRead),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contactMessages"] });
      toast({ title: "Message Updated" });
    },
    onError: (error: Error) => {
      toast({ variant: "destructive", title: "Error", description: error.message });
    },
  });

  const deleteMessageMutation = useMutation({
    mutationFn: contactApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contactMessages"] });
      toast({ title: "Message Deleted", variant: "destructive" });
    },
    onError: (error: Error) => {
      toast({ variant: "destructive", title: "Error", description: error.message });
    },
  });

  const handleSaveGalleryItem = () => {
    if (!galleryFormData.url) return;
    createGalleryItemMutation.mutate(galleryFormData);
  };

  const handleSaveAccountSettings = () => {
    if (accountSettings.newPassword && accountSettings.newPassword !== accountSettings.confirmPassword) {
      toast({ variant: "destructive", title: "Error", description: "New passwords do not match" });
      return;
    }

    updateAccountMutation.mutate({
      name: accountSettings.name,
      email: accountSettings.email,
      currentPassword: accountSettings.currentPassword || undefined,
      newPassword: accountSettings.newPassword || undefined,
    });
  };

  const handleOpenDialog = (tour?: Tour) => {
    if (tour) {
      setEditingTour(tour);
      setFormData({
        title: tour.title,
        location: tour.location,
        price: tour.price,
        duration: tour.duration,
        description: tour.description,
        image: tour.image,
        highlights: tour.highlights,
      });
    } else {
      setEditingTour(null);
      setFormData({
        title: "",
        location: "",
        price: 0,
        duration: "",
        description: "",
        image: "https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&q=80&w=800",
        highlights: [],
      });
    }
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (!formData.title || !formData.price) return;

    if (editingTour) {
      updateTourMutation.mutate({ id: editingTour.id, data: formData });
    } else {
      createTourMutation.mutate(formData);
    }
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this tour?")) {
      deleteTourMutation.mutate(id);
    }
  };

  const handleLogout = async () => {
    await logout();
    setLocation("/login");
  };

  return (
    <div className="min-h-screen flex bg-muted/20 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-primary text-white hidden md:flex flex-col">
        <div className="p-6">
          <h1 className="text-2xl font-serif font-bold">Japhazel<span className="text-accent">.</span></h1>
          <p className="text-xs text-white/50 uppercase tracking-widest mt-1">Admin Panel</p>
          {user && <p className="text-xs text-white/70 mt-2">{user.email}</p>}
        </div>
        
        <nav className="flex-grow px-4 space-y-2 mt-6">
          {[
            { id: "dashboard", icon: LayoutDashboard, label: "Overview" },
            { id: "tours", icon: Map, label: "Tours & Packages" },
            { id: "bookings", icon: Calendar, label: "Bookings" },
            { id: "media", icon: ImageIcon, label: "Media Library" },
            { id: "messages", icon: MailIcon, label: "Messages" },
            { id: "users", icon: Users, label: "Users" },
            { id: "settings", icon: Settings, label: "Settings" },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-md transition-colors text-sm font-medium ${
                activeTab === item.id 
                  ? "bg-accent text-white" 
                  : "text-white/70 hover:bg-white/10 hover:text-white"
              }`}
              data-testid={`button-tab-${item.id}`}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-white/10">
          <Button 
            variant="ghost" 
            className="w-full justify-start text-white/70 hover:text-white hover:bg-white/10 gap-3"
            onClick={handleLogout}
            data-testid="button-logout"
          >
            <LogOut className="h-5 w-5" /> Logout
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          <div className="mb-8">
            <h2 className="text-3xl font-serif font-bold text-primary">
              {activeTab === "dashboard" && "Dashboard Overview"}
              {activeTab === "tours" && "Manage Tours"}
              {activeTab === "bookings" && "Manage Bookings"}
              {activeTab === "media" && "Media Library"}
              {activeTab === "messages" && "Contact Inquiries"}
              {activeTab === "users" && "User Management"}
              {activeTab === "settings" && "Settings"}
            </h2>
          </div>

          {/* Dashboard Tab */}
          {activeTab === "dashboard" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm text-muted-foreground">Total Tours</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-4xl font-bold text-primary">{tours.length}</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm text-muted-foreground">Total Bookings</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-4xl font-bold text-accent">{bookings.length}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm text-muted-foreground">Pending Bookings</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-4xl font-bold text-orange-500">
                    {bookings.filter(b => b.status === "pending").length}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm text-muted-foreground">Confirmed Bookings</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-4xl font-bold text-green-600">
                    {bookings.filter(b => b.status === "confirmed").length}
                  </p>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Tours Tab */}
          {activeTab === "tours" && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <p className="text-muted-foreground">{tours.length} tours total</p>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button 
                      className="bg-accent hover:bg-accent/90"
                      onClick={() => handleOpenDialog()}
                      data-testid="button-add-tour"
                    >
                      <Plus className="h-4 w-4 mr-2" /> Add New Tour
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle className="font-serif text-2xl">
                        {editingTour ? "Edit Tour" : "Add New Tour"}
                      </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 pt-4">
                      <div>
                        <label className="text-sm font-medium">Title</label>
                        <Input 
                          value={formData.title} 
                          onChange={(e) => setFormData({...formData, title: e.target.value})}
                          placeholder="Tour Title"
                          data-testid="input-tour-title"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Location</label>
                        <Input 
                          value={formData.location} 
                          onChange={(e) => setFormData({...formData, location: e.target.value})}
                          placeholder="Location"
                          data-testid="input-tour-location"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Price</label>
                        <Input 
                          type="number" 
                          value={formData.price} 
                          onChange={(e) => setFormData({...formData, price: parseInt(e.target.value) || 0})}
                          placeholder="Price"
                          data-testid="input-tour-price"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Duration</label>
                        <Input 
                          value={formData.duration} 
                          onChange={(e) => setFormData({...formData, duration: e.target.value})}
                          placeholder="e.g. 7 Days"
                          data-testid="input-tour-duration"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Image URL</label>
                        <Input 
                          value={formData.image} 
                          onChange={(e) => setFormData({...formData, image: e.target.value})}
                          placeholder="Image URL"
                          data-testid="input-tour-image"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Description</label>
                        <Textarea 
                          value={formData.description} 
                          onChange={(e) => setFormData({...formData, description: e.target.value})}
                          placeholder="Tour description..."
                          rows={4}
                          data-testid="textarea-tour-description"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Highlights (comma-separated)</label>
                        <Textarea 
                          value={formData.highlights.join(", ")} 
                          onChange={(e) => setFormData({...formData, highlights: e.target.value.split(",").map(h => h.trim())})}
                          placeholder="Highlight 1, Highlight 2, Highlight 3"
                          rows={3}
                          data-testid="textarea-tour-highlights"
                        />
                      </div>
                      <Button 
                        onClick={handleSave} 
                        className="w-full bg-accent hover:bg-accent/90"
                        data-testid="button-save-tour"
                      >
                        {editingTour ? "Update Tour" : "Create Tour"}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              {toursLoading ? (
                <div className="text-center py-12">Loading tours...</div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {tours.map((tour) => (
                    <Card key={tour.id} className="overflow-hidden">
                      <div className="h-48 bg-cover bg-center" style={{ backgroundImage: `url(${tour.image})` }} />
                      <CardContent className="p-4">
                        <h3 className="font-bold text-lg mb-2">{tour.title}</h3>
                        <p className="text-sm text-muted-foreground mb-2">{tour.location}</p>
                        <p className="text-lg font-bold text-accent mb-4">${tour.price}</p>
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleOpenDialog(tour)}
                            data-testid={`button-edit-tour-${tour.id}`}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="destructive"
                            onClick={() => handleDelete(tour.id)}
                            data-testid={`button-delete-tour-${tour.id}`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Bookings Tab */}
          {activeTab === "bookings" && (
            <div>
              {bookingsLoading ? (
                <div className="text-center py-12">Loading bookings...</div>
              ) : bookings.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">No bookings yet</div>
              ) : (
                <div className="space-y-4">
                  {bookings.map((booking) => (
                    <Card key={booking.id}>
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-bold text-lg">{booking.customerName}</h3>
                            <p className="text-sm text-muted-foreground">{booking.customerEmail}</p>
                            <p className="text-sm text-muted-foreground">{booking.customerPhone}</p>
                            <p className="mt-2 text-sm">
                              <span className="font-medium">Guests:</span> {booking.numberOfGuests}
                            </p>
                            <p className="text-sm">
                              <span className="font-medium">Travel Date:</span> {booking.travelDate}
                            </p>
                            {booking.specialRequests && (
                              <p className="text-sm mt-2">
                                <span className="font-medium">Special Requests:</span> {booking.specialRequests}
                              </p>
                            )}
                          </div>
                          <div className="flex flex-col gap-2">
                            <select
                              value={booking.status}
                              onChange={(e) => updateBookingStatusMutation.mutate({ id: booking.id, status: e.target.value })}
                              className="px-3 py-2 border border-border rounded-md bg-background"
                              data-testid={`select-booking-status-${booking.id}`}
                            >
                              <option value="pending">Pending</option>
                              <option value="confirmed">Confirmed</option>
                              <option value="cancelled">Cancelled</option>
                            </select>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === "settings" && (
            <div className="max-w-2xl">
              <Card>
                <CardHeader>
                  <CardTitle className="font-serif">Account Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <label className="text-sm font-medium">Name</label>
                    <Input
                      value={accountSettings.name}
                      onChange={(e) => setAccountSettings({ ...accountSettings, name: e.target.value })}
                      placeholder="Your name"
                      data-testid="input-settings-name"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium">Email</label>
                    <Input
                      type="email"
                      value={accountSettings.email}
                      onChange={(e) => setAccountSettings({ ...accountSettings, email: e.target.value })}
                      placeholder="your@email.com"
                      data-testid="input-settings-email"
                    />
                  </div>

                  <div className="pt-4 border-t border-border">
                    <h4 className="font-medium mb-4">Change Password</h4>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium">Current Password</label>
                        <Input
                          type="password"
                          value={accountSettings.currentPassword}
                          onChange={(e) => setAccountSettings({ ...accountSettings, currentPassword: e.target.value })}
                          placeholder="Enter current password"
                          data-testid="input-settings-current-password"
                        />
                      </div>

                      <div>
                        <label className="text-sm font-medium">New Password</label>
                        <Input
                          type="password"
                          value={accountSettings.newPassword}
                          onChange={(e) => setAccountSettings({ ...accountSettings, newPassword: e.target.value })}
                          placeholder="Enter new password"
                          data-testid="input-settings-new-password"
                        />
                      </div>

                      <div>
                        <label className="text-sm font-medium">Confirm New Password</label>
                        <Input
                          type="password"
                          value={accountSettings.confirmPassword}
                          onChange={(e) => setAccountSettings({ ...accountSettings, confirmPassword: e.target.value })}
                          placeholder="Confirm new password"
                          data-testid="input-settings-confirm-password"
                        />
                      </div>
                    </div>
                  </div>

                  <Button
                    onClick={handleSaveAccountSettings}
                    className="w-full bg-accent hover:bg-accent/90"
                    disabled={updateAccountMutation.isPending}
                    data-testid="button-save-settings"
                  >
                    {updateAccountMutation.isPending ? "Saving..." : "Save Changes"}
                  </Button>
                </CardContent>
              </Card>

              <Card className="mt-8">
                <CardHeader>
                  <CardTitle className="font-serif">Site Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <label className="text-sm font-medium mb-1 block">Hero Media URLs</label>
                    <p className="text-xs text-muted-foreground mb-2">Enter image or video URLs separated by commas. Leave blank to use defaults.</p>
                    <div className="flex flex-col gap-2">
                      <Textarea
                        value={heroMediaUrls}
                        onChange={(e) => setHeroMediaUrls(e.target.value)}
                        placeholder="https://example.com/image1.jpg, https://youtu.be/xxx"
                        rows={3}
                      />
                      <Button 
                        onClick={() => updateSettingMutation.mutate({ key: "hero_media_urls", value: heroMediaUrls })}
                        disabled={updateSettingMutation.isPending || (settingsData && (settingsData["hero_media_urls"] ?? settingsData["hero_video"] ?? "") === heroMediaUrls)}
                        className="self-end"
                      >
                        {updateSettingMutation.isPending ? "Saving..." : "Save"}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Media Tab */}
          {activeTab === "media" && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <p className="text-muted-foreground">{gallery.length} images total</p>
                <Dialog open={isGalleryDialogOpen} onOpenChange={setIsGalleryDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-accent hover:bg-accent/90">
                      <ImageIcon className="h-4 w-4 mr-2" /> Add Image URL
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle className="font-serif text-2xl">Add to Media Library</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 pt-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Image URL (Unsplash or direct link)</label>
                        <Input 
                          value={galleryFormData.url} 
                          onChange={(e) => setGalleryFormData({...galleryFormData, url: e.target.value})}
                          placeholder="https://images.unsplash.com/..."
                          data-testid="input-gallery-url"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Caption (Optional)</label>
                        <Input 
                          value={galleryFormData.caption} 
                          onChange={(e) => setGalleryFormData({...galleryFormData, caption: e.target.value})}
                          placeholder="Beautiful sunset in Serengeti"
                          data-testid="input-gallery-caption"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Category</label>
                        <select 
                          value={galleryFormData.category}
                          onChange={(e) => setGalleryFormData({...galleryFormData, category: e.target.value})}
                          className="w-full px-3 py-2 border border-border rounded-md bg-background text-sm"
                          data-testid="select-gallery-category"
                        >
                          <option value="general">General</option>
                          <option value="wildlife">Wildlife</option>
                          <option value="nature">Nature</option>
                          <option value="luxury">Luxury</option>
                          <option value="culture">Culture</option>
                        </select>
                      </div>
                      <Button 
                        onClick={handleSaveGalleryItem} 
                        className="w-full bg-accent hover:bg-accent/90"
                        disabled={createGalleryItemMutation.isPending}
                        data-testid="button-save-gallery"
                      >
                        {createGalleryItemMutation.isPending ? "Adding..." : "Add to Gallery"}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              {galleryLoading ? (
                <div className="text-center py-12">Loading gallery...</div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {gallery.map((item) => (
                    <Card key={item.id} className="group relative overflow-hidden aspect-square">
                      <img 
                        src={item.url} 
                        alt={item.caption || "Gallery item"} 
                        className="w-full h-full object-cover transition-transform group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                        {item.caption && <p className="text-white text-xs mb-2 line-clamp-2">{item.caption}</p>}
                        <div className="flex gap-2">
                          <Button 
                            variant="destructive" 
                            size="sm" 
                            className="w-full h-8"
                            onClick={() => {
                              if (confirm("Delete this image?")) {
                                deleteGalleryItemMutation.mutate(item.id);
                              }
                            }}
                            data-testid={`button-delete-gallery-${item.id}`}
                          >
                            <Trash2 className="h-3 w-3 mr-1" /> Delete
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* User Tab */}
          {activeTab === "users" && (
            <Card>
              <CardContent className="p-12 text-center">
                <p className="text-muted-foreground">This section is under development.</p>
              </CardContent>
            </Card>
          )}

          {/* Messages Tab */}
          {activeTab === "messages" && (
            <div>
              {messagesLoading ? (
                <div className="text-center py-12">Loading messages...</div>
              ) : messages.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">No current messages.</div>
              ) : (
                <div className="space-y-4">
                  {messages.map((msg) => (
                    <Card key={msg.id} className={msg.isRead ? "bg-muted/30" : "border-primary/50 shadow-sm"}>
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              {!msg.isRead && <span className="bg-primary text-white text-[10px] px-2 py-0.5 rounded-full uppercase font-bold tracking-wider">New</span>}
                              <h3 className="font-bold text-lg">{msg.subject}</h3>
                            </div>
                            <p className="text-sm font-medium mb-1">{msg.name || "Anonymous Sender"}</p>
                            <p className="text-sm text-muted-foreground mb-4">
                              <a href={`mailto:${msg.email}`} className="text-accent hover:underline">{msg.email || "No email"}</a>
                              {msg.phoneNumber && (
                                <>
                                  <span className="mx-2">•</span>
                                  {msg.phoneNumber}
                                </>
                              )}
                              <span className="mx-2">•</span> 
                              {new Date(msg.createdAt).toLocaleDateString()} at {new Date(msg.createdAt).toLocaleTimeString()}
                            </p>
                            <div className="p-4 bg-background rounded-md text-sm border border-border/50 whitespace-pre-wrap">
                              {msg.message}
                            </div>
                          </div>
                          <div className="flex flex-col gap-2 min-w-[120px]">
                            {msg.isRead ? (
                              <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => updateMessageStatusMutation.mutate({ id: msg.id, isRead: false })}
                              >
                                <Clock className="w-4 h-4 mr-2" /> Mark Unread
                              </Button>
                            ) : (
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="bg-primary/10 hover:bg-primary/20 text-primary border-primary/20"
                                onClick={() => updateMessageStatusMutation.mutate({ id: msg.id, isRead: true })}
                              >
                                <CheckCircle className="w-4 h-4 mr-2" /> Mark Read
                              </Button>
                            )}
                            <Button 
                              variant="destructive" 
                              size="sm"
                              onClick={() => {
                                if (confirm("Are you sure you want to delete this message?")) {
                                  deleteMessageMutation.mutate(msg.id);
                                }
                              }}
                            >
                              <Trash2 className="w-4 h-4 mr-2" /> Delete
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
