import React from 'react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  items: Array<{
    icon: React.ReactNode;
    label: string;
    href?: string;
    active?: boolean;
    onClick?: () => void;
  }>;
  className?: string;
}

const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  items,
  className = ''
}) => {
  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        fixed top-0 left-0 h-full w-64 bg-slate-900/95 backdrop-blur-lg 
        border-r border-white/20 transform transition-transform duration-300 z-50
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:static md:w-64
        ${className}
      `}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-white">Legacy Modernizer</h2>
            </div>
            <button
              onClick={onClose}
              className="md:hidden text-white/60 hover:text-white transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <nav className="space-y-2">
            {items.map((item, index) => (
              <a
                key={index}
                href={item.href || '#'}
                onClick={(e) => {
                  if (item.onClick) {
                    e.preventDefault();
                    item.onClick();
                  }
                  if (window.innerWidth < 768) {
                    onClose();
                  }
                }}
                className={`
                  flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200
                  ${item.active 
                    ? 'bg-gradient-to-r from-blue-600/20 to-purple-600/20 text-white border border-blue-500/30' 
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                  }
                `}
              >
                <div className={`${item.active ? 'text-blue-400' : 'text-white/60'}`}>
                  {item.icon}
                </div>
                <span className="font-medium">{item.label}</span>
                {item.active && (
                  <div className="ml-auto w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                )}
              </a>
            ))}
          </nav>
        </div>

        {/* Bottom section */}
        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-white/10">
          <div className="space-y-3">
            <div className="flex items-center space-x-3 px-4 py-2">
              <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div>
                <div className="text-sm font-medium text-white">David Ojo</div>
                <div className="text-xs text-white/60">Admin</div>
              </div>
            </div>
            
            <button className="w-full flex items-center justify-center space-x-2 px-4 py-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span className="text-sm">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;