import {
  IconAd2,
  IconApiApp,
  IconBellRinging,
  IconCalendar,
  IconCalendarStats,
  IconClipboardText,
  IconCpu,
  IconListDetails,
  IconNews,
  IconNotebook,
  IconPencilMinus,
  IconProgressCheck,
  IconSettingsCode,
  IconSofa,
  IconSpy,
} from "@tabler/icons-react";
import { LayoutDashboard, Package } from "lucide-react";
import { useLocation, useNavigate } from "react-router";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "../ui/sidebar";

const AppSidebar = () => {
  const pathname = useLocation().pathname;
  const navigate = useNavigate();

  const checkActive = (path: string) => pathname === path;

  return (
    <Sidebar variant="inset">
      {/* ~ =================================== ~ */}
      {/* -- Header -- */}
      {/* ~ =================================== ~ */}
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuButton>DO something</SidebarMenuButton>
        </SidebarMenu>
      </SidebarHeader>
      {/* ~ =================================== ~ */}
      {/* -- Content -- */}
      {/* ~ =================================== ~ */}
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                isActive={checkActive("/")}
                onClick={() => navigate("/")}
                size="default"
              >
                <IconSofa size={20} stroke={1.5} />
                <span>Home</span>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton
                isActive={checkActive("/about")}
                onClick={() => navigate("/about")}
                size="default"
              >
                <IconClipboardText size={20} stroke={1.5} />
                <span>About</span>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton
                isActive={checkActive("/projects")}
                onClick={() => navigate("/projects")}
                size="default"
              >
                <IconApiApp size={20} stroke={1.5} />
                <span>Projects</span>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton
                isActive={checkActive("/operating-system")}
                onClick={() => navigate("/operating-system")}
                size="default"
              >
                <IconCpu size={20} stroke={1.5} />
                <span>Operating System</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Others</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton>
                  <IconPencilMinus size={20} stroke={1.5} />
                  <span>Blog</span>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton>
                  <IconSpy size={20} stroke={1.5} />
                  <span>Hackathons</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* ~ =================================== ~ */}
      {/* -- Footer -- */}
      {/* ~ =================================== ~ */}
      <SidebarFooter />
    </Sidebar>
  );
};

export default AppSidebar;
